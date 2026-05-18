import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "@/email/email.service";
import { PrismaService } from "@/prisma/prisma.service";
import { SubscribersService } from "./subscribers.service";

const mockPrismaService = {
  subscriber: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockEmailService = {
  sendEmail: jest.fn(),
};

describe("SubscribersService", () => {
  let service: SubscribersService;
  let prisma: typeof mockPrismaService;
  let email: typeof mockEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscribersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<SubscribersService>(SubscribersService);
    prisma = module.get(PrismaService);
    email = module.get(EmailService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a subscriber", async () => {
      const dto = { email: "test@example.com" };
      prisma.subscriber.create.mockResolvedValue({
        id: 1,
        ...dto,
        isActive: true,
        createdAt: new Date(),
      });

      const result = await service.create(dto);
      expect(result).toHaveProperty("id");
      expect(prisma.subscriber.create).toHaveBeenCalledWith({ data: dto });
    });

    it("should throw ConflictException if email exists", async () => {
      const dto = { email: "exists@example.com" };
      prisma.subscriber.create.mockRejectedValue({ code: "P2002" }); // Prisma unique constraint error

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe("sendNewsletter", () => {
    it("should send email to active subscribers", async () => {
      const subscribers = [
        { id: 1, email: "a@test.com", isActive: true },
        { id: 2, email: "b@test.com", isActive: true },
      ];
      prisma.subscriber.findMany.mockResolvedValue(subscribers);
      email.sendEmail.mockResolvedValue({ messageId: "123" });

      const dto = { subject: "News", message: "Hello" };
      const result = await service.sendNewsletter(dto);

      expect(prisma.subscriber.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
      expect(email.sendEmail).toHaveBeenCalledTimes(2);
      expect(result.sentCount).toBe(2);
    });
  });
});
