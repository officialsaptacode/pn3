import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { SmsController } from "./sms.controller";
import { SmsProcessor } from "./sms.processor";
import { SmsService } from "./sms.service";
import { SmsWsGateway } from "./ws/gateway";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "sms-queue",
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    }),
  ],
  providers: [SmsService, SmsProcessor, SmsWsGateway],
  controllers: [SmsController],
})
export class SmsModule {}
