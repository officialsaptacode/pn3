import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { BullModule } from '@nestjs/bullmq';
import { SmsProcessor } from './sms.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sms-queue',
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    }),
  ],
  providers: [SmsService, SmsProcessor],
  controllers: [SmsController]
})
export class SmsModule {}
