import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { GetCurrentUserId, Roles } from "@/auth/decorator";
import { AtGuard, RolesGuard } from "@/auth/guard";
import { Role } from "@/generated";
import { CampaignListQueryDto, TemplateListQueryDto } from "./dto/sms-query.dto";
import { SmsService } from "./sms.service";

@Controller("sms")
@UseGuards(AtGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post("presigned-url")
  async getPresignedUrl(
    @Body("filename") filename: string,
    @Body("contentType") contentType: string,
  ) {
    return this.smsService.generatePresignedUrl(filename, contentType);
  }

  @Post("templates")
  async createTemplate(
    @GetCurrentUserId() userId: number,
    @Body("name") name: string,
    @Body("content") content: string,
  ) {
    return this.smsService.createTemplate(userId, name, content);
  }

  @Post("templates/:id/evaluate")
  async evaluateTemplate(@Param("id", ParseIntPipe) id: number) {
    return this.smsService.evaluateTemplate(id);
  }

  @Post("campaigns")
  async createCampaign(
    @GetCurrentUserId() userId: number,
    @Body("name") name: string,
    @Body("templateId") templateId: number,
    @Body("csvUrl") csvUrl: string,
  ) {
    return this.smsService.createCampaign(userId, name, templateId, csvUrl);
  }

  // ── Admin reads (class-level AtGuard still applies; RolesGuard is additive) ──

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/overview")
  getOverview() {
    return this.smsService.getOverview();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/templates")
  listTemplates(@Query() query: TemplateListQueryDto) {
    return this.smsService.listTemplates(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/campaigns")
  listCampaigns(@Query() query: CampaignListQueryDto) {
    return this.smsService.listCampaigns(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/campaigns/:id")
  getCampaign(@Param("id", ParseIntPipe) id: number) {
    return this.smsService.getCampaign(id);
  }
}
