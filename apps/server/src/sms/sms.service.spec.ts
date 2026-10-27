import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/prisma/prisma.service";
import { SmsService } from "./sms.service";

describe("SmsService", () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: PrismaService,
          useValue: {
            smsTemplate: {},
            campaign: {},
            smsJob: {},
            optOut: {},
          },
        },
        {
          provide: "sms-queue",
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
