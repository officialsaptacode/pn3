import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/prisma/prisma.service";
import { MediaService } from "./media.service";

// Mock AWS SDK
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

// Mock uuid
jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-uuid"),
}));

describe("MediaService", () => {
  let service: MediaService;
  let _prismaService: PrismaService;

  const mockPrismaService = {
    media: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Set environment variables for AWS
    process.env.AWS_REGION = "us-east-1";
    process.env.AWS_S3_BUCKET = "test-bucket";
    process.env.AWS_ACCESS_KEY_ID = "test-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret";

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    _prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated media", async () => {
      const mockMedia = [{ id: 1, url: "test-url", type: "IMAGE" }];
      mockPrismaService.media.findMany.mockResolvedValue(mockMedia);
      mockPrismaService.media.count.mockResolvedValue(1);

      const result = await service.findAll({ limit: 20, page: 1 });

      expect(result).toEqual({
        data: mockMedia,
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });
      expect(mockPrismaService.media.findMany).toHaveBeenCalledWith({
        take: 20,
        skip: 0,
        where: {},
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, userName: true, email: true },
          },
        },
      });
    });
  });

  describe("bulkUpload", () => {
    it("should upload multiple files", async () => {
      const mockFiles = [
        {
          originalname: "test1.jpg",
          mimetype: "image/jpeg",
          buffer: Buffer.from("test1"),
          size: 1024,
        },
        {
          originalname: "test2.jpg",
          mimetype: "image/jpeg",
          buffer: Buffer.from("test2"),
          size: 1024,
        },
      ] as Express.Multer.File[];

      const mockMedia1 = { id: 1, filename: "test1.jpg" };
      const mockMedia2 = { id: 2, filename: "test2.jpg" };

      // Spy on uploadFile
      const uploadFileSpy = jest
        .spyOn(service, "uploadFile")
        .mockResolvedValueOnce(mockMedia1 as any)
        .mockResolvedValueOnce(mockMedia2 as any);

      const result = await service.bulkUpload(mockFiles, "bulk-folder", 1);

      expect(result).toHaveLength(2);
      expect(uploadFileSpy).toHaveBeenCalledTimes(2);
      expect(uploadFileSpy).toHaveBeenCalledWith(mockFiles[0], "bulk-folder", 1);
      expect(uploadFileSpy).toHaveBeenCalledWith(mockFiles[1], "bulk-folder", 1);
    });
  });

  describe("delete", () => {
    it("should delete media and return the deleted record", async () => {
      const mockMedia = {
        id: 1,
        url: "https://test-bucket.s3.us-east-1.amazonaws.com/test-key",
      };
      mockPrismaService.media.findUnique.mockResolvedValue(mockMedia);
      mockPrismaService.media.delete.mockResolvedValue(mockMedia);

      const result = await service.delete(1);

      expect(result).toEqual(mockMedia);
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.media.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null if media not found", async () => {
      mockPrismaService.media.findUnique.mockResolvedValue(null);

      const result = await service.delete(999);

      expect(result).toBeNull();
      expect(mockPrismaService.media.delete).not.toHaveBeenCalled();
    });
  });
});
