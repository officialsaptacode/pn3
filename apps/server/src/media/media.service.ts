import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { MediaType } from "@/generated";
import { PrismaService } from "@/prisma/prisma.service";
import { MediaQueryDto } from "./dto/media-query.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET;
  private region = process.env.AWS_REGION || "us-east-1";

  constructor(private prisma: PrismaService) {
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
    uploadedBy?: number,
    altText?: string,
    caption?: string,
  ) {
    if (!file) return null;

    const fileExt = file.originalname.split(".").pop();
    const filename = `${uuidv4()}.${fileExt}`;

    // Construct Key with folder if provided
    let key = filename;
    if (folder) {
      // Clean folder path: remove leading/trailing slashes
      const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
      key = `${cleanFolder}/${filename}`;
    }

    // Determine type
    const type = file.mimetype.startsWith("video") ? MediaType.VIDEO : MediaType.IMAGE;

    try {
      // Upload to S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      // Save to DB with all metadata
      const media = await this.prisma.media.create({
        data: {
          url,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          type,
          s3Key: key,
          s3Bucket: this.bucketName || "",
          folder: folder || null,
          uploadedBy,
          altText: altText || file.originalname,
          caption,
          // Width/Height would typically be extracted here using 'sharp' if available
        },
      });

      return media;
    } catch (error: any) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new InternalServerErrorException("Failed to upload file");
    }
  }

  async bulkUpload(files: Array<Express.Multer.File>, folder?: string, uploadedBy?: number) {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) => this.uploadFile(file, folder, uploadedBy));

    const results = await Promise.allSettled(uploadPromises);

    // Return successful uploads
    return results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
      .map((result) => result.value)
      .filter((item) => item !== null);
  }

  async findAll(query: MediaQueryDto) {
    const { page = 1, limit = 20, search, folder, type } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
      ];
    }

    if (folder) {
      where.folder = folder;
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, userName: true, email: true },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException(`Media with ID ${id} not found`);
    return media;
  }

  async update(id: number, updateDto: UpdateMediaDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.media.update({
      where: { id },
      data: updateDto,
    });
  }

  async delete(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) return null;

    // Delete from S3 using stored key
    if (media.s3Key && this.bucketName) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: media.s3Key,
          }),
        );
      } catch (e: any) {
        this.logger.warn(`Failed to delete S3 object for media ${id}: ${e.message}`);
      }
    } else if (media.url) {
      // Fallback for old records without s3Key: Extract key from URL
      try {
        const urlParts = media.url.split("/");
        const key = urlParts[urlParts.length - 1];
        if (key && this.bucketName) {
          await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
        }
      } catch (e: any) {
        this.logger.warn(`Failed to delete S3 object for media ${id} (fallback): ${e.message}`);
      }
    }

    return this.prisma.media.delete({ where: { id } });
  }

  /**
   * Get list of unique folders
   */
  async getFolders() {
    // Prisma doesn't support distinct on specific column easily with return type of just that column in simplified findMany
    // But we can use groupBy
    const folders = await this.prisma.media.groupBy({
      by: ["folder"],
      where: {
        folder: { not: null },
      },
      _count: {
        id: true,
      },
    });

    return folders.map((f: { folder: any; _count: { id: any } }) => ({
      name: f.folder,
      count: f._count.id,
    }));
  }
}
