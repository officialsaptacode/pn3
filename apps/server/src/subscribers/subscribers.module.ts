import { Module } from "@nestjs/common";
import { SubscribersController } from "./subscribers.controller";
import { SubscribersService } from "./subscribers.service";

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}
