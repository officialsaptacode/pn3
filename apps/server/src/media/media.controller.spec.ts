import { Test, type TestingModule } from "@nestjs/testing";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

// Mock the @aws-sdk/client-s3 module to prevent initialization errors
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

describe("MediaController", () => {
  let controller: MediaController;

  const mockMediaService = {
    uploadFile: jest.fn(),
    bulkUpload: jest.fn(),
    findAll: jest.fn(),
    getFolders: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    // Set environment variables for AWS
    process.env.AWS_REGION = "us-east-1";
    process.env.AWS_S3_BUCKET = "test-bucket";
    process.env.AWS_ACCESS_KEY_ID = "test-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret";

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: mockMediaService,
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("uploadFile", () => {
    it("should call mediaService.uploadFile with file and metadata", () => {
      const mockFile = {
        originalname: "test.jpg",
        buffer: Buffer.from("test"),
        mimetype: "image/jpeg",
        fieldname: "file",
        encoding: "7bit",
        size: 1024,
      };

      const expectedResult = { id: 1, url: "test-url" };
      mockMediaService.uploadFile.mockReturnValue(expectedResult);

      const result = controller.uploadFile(mockFile as any, 1, "caption", "altText", "folder");

      expect(result).toEqual(expectedResult);
      expect(mockMediaService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        "folder",
        1,
        "altText",
        "caption",
      );
    });
  });

  describe("findAll", () => {
    it("should call mediaService.findAll with query dto", () => {
      const expectedResult = { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
      mockMediaService.findAll.mockReturnValue(expectedResult);

      const queryDto = { limit: 20, page: 1 };
      const result = controller.findAll(queryDto);

      expect(result).toEqual(expectedResult);
      expect(mockMediaService.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe("remove", () => {
    it("should call mediaService.delete with id", () => {
      const expectedResult = { id: 1, url: "test-url" };
      mockMediaService.delete.mockReturnValue(expectedResult);

      const result = controller.remove(1);

      expect(result).toEqual(expectedResult);
      expect(mockMediaService.delete).toHaveBeenCalledWith(1);
    });
  });
});
