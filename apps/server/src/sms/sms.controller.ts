import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { SmsService } from './sms.service';
import { AtGuard } from '@/auth/guard';
import { GetCurrentUserId } from '@/auth/decorator';

@Controller('sms')
@UseGuards(AtGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('presigned-url')
  async getPresignedUrl(
    @GetCurrentUserId() userId: number,
    @Body('filename') filename: string,
    @Body('contentType') contentType: string,
  ) {
    return this.smsService.generatePresignedUrl(filename, contentType);
  }

  @Post('templates')
  async createTemplate(
    @GetCurrentUserId() userId: number,
    @Body('name') name: string,
    @Body('content') content: string,
  ) {
    return this.smsService.createTemplate(userId, name, content);
  }

  @Post('templates/:id/evaluate')
  async evaluateTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.smsService.evaluateTemplate(id);
  }

  @Post('campaigns')
  async createCampaign(
    @GetCurrentUserId() userId: number,
    @Body('name') name: string,
    @Body('templateId') templateId: number,
    @Body('csvUrl') csvUrl: string,
  ) {
    return this.smsService.createCampaign(userId, name, templateId, csvUrl);
  }
}
