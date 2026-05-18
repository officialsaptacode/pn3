import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Roles } from "@/auth/decorator";
import { AtGuard, RolesGuard } from "@/auth/guard";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { SendNewsletterDto } from "./dto/send-newsletter.dto";
import { SubscribersService } from "./subscribers.service";

@Controller("subscribers")
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  subscribe(@Body() dto: CreateSubscriberDto) {
    return this.subscribersService.create(dto);
  }

  @UseGuards(AtGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.subscribersService.findAll();
  }

  @UseGuards(AtGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("send")
  sendNewsletter(@Body() dto: SendNewsletterDto) {
    return this.subscribersService.sendNewsletter(dto);
  }
}
