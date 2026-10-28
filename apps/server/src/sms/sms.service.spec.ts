import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/prisma/prisma.service";
import { SmsService } from "./sms.service";

describe("SmsService", () => {
  let service: SmsService;
  let prisma: {
    smsTemplate: Record<string, jest.Mock>;
    campaign: Record<string, jest.Mock>;
    smsJob: Record<string, jest.Mock>;
    optOut: Record<string, jest.Mock>;
  };
  let queue: { add: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    prisma = {
      smsTemplate: {},
      campaign: {},
      smsJob: {},
      optOut: {},
    };
    queue = {
      add: jest.fn().mockResolvedValue({ id: "1" }),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        { provide: PrismaService, useValue: prisma },
        { provide: "sms-queue", useValue: queue },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("scheduleCampaign", () => {
    const pendingJobs = [
      { id: 10n, phoneNumber: "+8801700000001", payload: { message: "hi" } },
      { id: 11n, phoneNumber: "+8801700000002", payload: { message: "hi" } },
    ];

    beforeEach(() => {
      prisma.campaign.findUnique = jest.fn().mockResolvedValue({ id: 7, name: "Launch" });
      prisma.smsJob.count = jest.fn().mockResolvedValue(0);
      prisma.smsJob.findMany = jest.fn().mockResolvedValue(pendingJobs);
      prisma.campaign.update = jest.fn().mockImplementation(({ data }) => Promise.resolve(data));
    });

    it("throws when the campaign does not exist", async () => {
      prisma.campaign.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.scheduleCampaign(7, {})).rejects.toBeInstanceOf(NotFoundException);
    });

    it("refuses to reschedule once the campaign has started sending", async () => {
      prisma.smsJob.count = jest.fn().mockResolvedValue(1);
      await expect(service.scheduleCampaign(7, {})).rejects.toBeInstanceOf(BadRequestException);
      expect(queue.add).not.toHaveBeenCalled();
    });

    it("re-queues pending jobs with a delay and marks the campaign SCHEDULED", async () => {
      const sendAt = new Date(Date.now() + 60_000).toISOString();

      await service.scheduleCampaign(7, { sendAt });

      expect(queue.remove).toHaveBeenCalledTimes(2);
      expect(queue.remove).toHaveBeenCalledWith("sms-10");
      expect(queue.add).toHaveBeenCalledTimes(2);
      expect(queue.add).toHaveBeenCalledWith(
        "send-sms",
        expect.objectContaining({ campaignId: 7, jobId: 10, phoneNumber: "+8801700000001" }),
        expect.objectContaining({ delay: expect.any(Number), jobId: "sms-10" }),
      );
      expect(queue.add.mock.calls[0][2].delay).toBeGreaterThan(0);
      expect(prisma.campaign.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: expect.objectContaining({ status: "SCHEDULED" }),
      });
    });

    it("sends immediately when no sendAt is given", async () => {
      await service.scheduleCampaign(7, {});

      expect(queue.add).toHaveBeenCalledTimes(2);
      expect(queue.add.mock.calls[0][2].delay).toBe(0);
      expect(prisma.campaign.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: expect.objectContaining({ sendAt: null, status: "SENDING" }),
      });
    });

    it("keeps scheduling when the old queue job can no longer be removed", async () => {
      queue.remove = jest.fn().mockRejectedValue(new Error("Job is active"));

      await expect(service.scheduleCampaign(7, {})).resolves.toBeDefined();
      expect(queue.add).toHaveBeenCalledTimes(2);
    });
  });
});
