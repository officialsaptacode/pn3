import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId, Public } from "@/auth/decorator";
import { AtGuard } from "@/auth/guard";
import { MediaQueryDto } from "./dto/media-query.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { MediaService } from "./media.service";

@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        caption: { type: "string" },
        altText: { type: "string" },
        folder: { type: "string" },
      },
    },
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Body("caption") caption?: string,
    @Body("altText") altText?: string,
    @Body("folder") folder?: string,
  ) {
    return this.mediaService.uploadFile(file, folder, userId, altText, caption);
  }

  @Post("bulk-upload")
  @UseGuards(AtGuard)
  @UseInterceptors(FilesInterceptor("files"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
        folder: { type: "string" },
      },
    },
  })
  bulkUpload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetCurrentUserId() userId: number,
    @Body("folder") folder?: string,
  ) {
    return this.mediaService.bulkUpload(files, folder, userId);
  }

  @Get()
  @Public() // Or guarded depending on requirement, usually media is public read
  findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get("folders")
  @UseGuards(AtGuard)
  getFolders() {
    return this.mediaService.getFolders();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.mediaService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AtGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateDto);
  }

  @Delete(":id")
  @UseGuards(AtGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.mediaService.delete(id);
  }
}
