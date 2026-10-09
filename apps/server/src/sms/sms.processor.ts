import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bullmq";
import { PrismaService } from "@/prisma/prisma.service";

@Processor("sms-queue", {
  concurrency: 5,
  limiter: {
    max: 50,
    duration: 1000,
  },
})
@Injectable()
export class SmsProcessor extends WorkerHost {
  private readonly logger = new Logger(SmsProcessor.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { campaignId, jobId, phoneNumber, payload } = job.data;

    this.logger.debug(`Processing SMS Job ${jobId} for +${phoneNumber}`);

    try {
      const isDryRun = this.configService.get("DRY_RUN") === "true";

      if (isDryRun) {
        this.logger.log(`[DRY RUN] Would send SMS to ${phoneNumber}: ${payload.message}`);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        this.logger.log(`Sending SMS to ${phoneNumber} via AkashSMS API...`);
        const akashAuthToken = this.configService.get("AKASHSMS_AUTH_TOKEN");
        if (!akashAuthToken) {
          throw new Error("Missing AKASHSMS_AUTH_TOKEN in environment");
        }

        const response = await fetch("https://aakashsms.com/admin/public/sms/v3/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth_token: akashAuthToken,
            to: phoneNumber,
            text: payload.message,
          }),
        });

        if (!response.ok) {
          const errData = await response.text();
          throw new Error(`AkashSMS API Error: ${response.status} - ${errData}`);
        }
      }

      await this.prisma.smsJob.update({
        where: { id: jobId },
        data: { status: "SENT" },
      });

      // Increment processedRows
      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { processedRows: { increment: 1 } },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send SMS to ${phoneNumber}: ${message}`);

      await this.prisma.smsJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          error: message,
        },
      });

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { failedRows: { increment: 1 } },
      });

      throw error; // Let BullMQ handle retry based on backoff
    }
  }
}
