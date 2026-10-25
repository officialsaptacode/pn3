import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { SmsWsGateway } from './ws/gateway';
import { BullModule } from '@nestjs/bullmq';
import { SmsProcessor } from './sms.processor';
import { WebSocketModule } from '@nestjs/websockets';

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
    WebSocketModule.forRoot({ path: 'ws' }),
  ],
  providers: [SmsService, SmsProcessor, SmsWsGateway],
  controllers: [SmsController]
})
export class SmsModule {}
