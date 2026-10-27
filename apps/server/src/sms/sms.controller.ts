import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GetCurrentUserId, Roles } from "@/auth/decorator";
import { AtGuard, RolesGuard } from "@/auth/guard";
import { Role } from "@/generated";
import {
  CampaignAnalyticsQueryDto,
  CampaignListQueryDto,
  TemplateListQueryDto,
} from "./dto/sms-query.dto";
import { AdvancedAnalyticsQueryDto } from "./dtos/advanced-analytics.dto";
import { ScheduleCampaignDto } from "./dtos/schedule-campaign.dto";
import { UpdateTemplateDto } from "./dtos/update-template.dto";
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/campaigns/:id/analytics")
  getCampaignAnalytics(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: CampaignAnalyticsQueryDto,
  ) {
    return this.smsService.getCampaignAnalytics(id, query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/campaigns/:id/advanced-analytics")
  getAdvancedAnalytics(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: AdvancedAnalyticsQueryDto,
  ) {
    return this.smsService.getAdvancedAnalytics(id, query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/gateway")
  getGatewayInfo() {
    return {
      name: "SmsGateway",
      docs: "/api-docs",
      status: "operational",
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("admin/campaigns/:id/schedule")
  async scheduleCampaign(@Param("id", ParseIntPipe) id: number, @Body() body: ScheduleCampaignDto) {
    return this.smsService.scheduleCampaign(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("admin/templates/:id")
  async updateTemplate(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateTemplateDto) {
    return this.smsService.updateTemplate(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("admin/templates/:id/evaluate")
  @HttpCode(HttpStatus.OK)
  async reevaluateTemplate(@Param("id", ParseIntPipe) id: number) {
    return this.smsService.evaluateTemplate(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("admin/campaigns/:id/retry")
  @HttpCode(HttpStatus.OK)
  async retryFailedJobs(@Param("id", ParseIntPipe) id: number) {
    return this.smsService.retryFailedJobs(id);
  }
}
