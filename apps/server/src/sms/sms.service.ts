import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InjectQueue } from "@nestjs/bullmq";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Queue } from "bullmq";
import { parse } from "csv-parse/sync";
import { Subject as RxSubject } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "@/prisma/prisma.service";
import {
  CampaignAnalyticsQueryDto,
  CampaignListQueryDto,
  TemplateListQueryDto,
} from "./dto/sms-query.dto";
import { AdvancedAnalyticsQueryDto } from "./dtos/advanced-analytics.dto";
import { ScheduleCampaignDto } from "./dtos/schedule-campaign.dto";
import { UpdateTemplateDto } from "./dtos/update-template.dto";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly jobEventSubject = new RxSubject<{
    campaignId: number;
    jobId: number;
    status: string;
  }>();
  readonly jobEvent$ = this.jobEventSubject.asObservable();
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET || "test-bucket";

  constructor(
    @InjectQueue("sms-queue") private smsQueue: Queue,
    private prisma: PrismaService,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      },
    });
  }

  emitJobEvent(event: { campaignId: number; jobId: number; status: string }) {
    this.jobEventSubject.next(event);
  }

  async generatePresignedUrl(filename: string, contentType: string) {
    const key = `csv-uploads/${uuidv4()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return { url, key, fullUrl: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  async createTemplate(userId: number, name: string, content: string) {
    // Generate AI content (System 2)
    let aiEnhancedContent = content;
    try {
      const openAiKey = process.env.OPENAI_API_KEY;
      if (openAiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are an assistant that enhances SMS templates for micro-finance. Keep it under 160 characters. Do not modify {} variables.",
              },
              { role: "user", content: `Enhance this SMS template: ${content}` },
            ],
          }),
        });
        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          aiEnhancedContent = data.choices[0].message.content;
        }
      }
    } catch (e) {
      this.logger.error("OpenAI enhancement failed, falling back to original content", e);
    }

    return this.prisma.smsTemplate.create({
      data: {
        name,
        content: aiEnhancedContent,
        userId,
      },
    });
  }

  async evaluateTemplate(templateId: number) {
    const template = await this.prisma.smsTemplate.findUnique({ where: { id: templateId } });
    if (!template) throw new BadRequestException("Template not found");

    // System 1: self-hosted Laya (laya-serve, Jev-compatible POST /v1/systemone).
    // convaiinnovations/laya answers typed questions — it is not a spam-label
    // classifier, so we ask a two-option choice with neutral keys (per Laya
    // docs, noul follows its option labels on this checkpoint).
    let layaScore = 0.1;
    try {
      const base = (process.env.LAYA_BASE_URL || "").replace(/\/+$/, "");
      const layaKey = process.env.LAYA_API_KEY;
      if (base) {
        const response = await fetch(`${base}/v1/systemone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(layaKey ? { Authorization: `Bearer ${layaKey}` } : {}),
          },
          body: JSON.stringify({
            state: { document: template.content },
            questions: {
              spam_check: {
                type: "choice",
                instructions:
                  "Is this SMS spam, fraud, or otherwise non-compliant for a micro-finance payment reminder?",
                criteria: {
                  A: "yes, it is spam, fraud, or non-compliant",
                  B: "no, it is a legitimate payment reminder",
                },
              },
            },
          }),
        });
        if (!response.ok) throw new Error(`Laya server responded ${response.status}`);
        const data = await response.json();
        const answer = data?.answers?.spam_check;
        const choice = String(answer?.choice ?? "").toLowerCase();
        const isSpam = choice === "a" || choice.startsWith("yes") || choice.includes("spam");
        const confidence = typeof answer?.confidence === "number" ? answer.confidence : null;
        layaScore =
          confidence != null ? (isSpam ? confidence : 1 - confidence) : isSpam ? 0.9 : 0.1;
        this.logger.log(
          `Laya scored template ${templateId}: choice=${answer?.choice} score=${layaScore}`,
        );
      } else {
        // Fallback mock logic if no server configured
        const isSpam = template.content.toLowerCase().includes("viagra");
        layaScore = isSpam ? 0.95 : 0.1;
      }
    } catch (e) {
      this.logger.error("Laya evaluation failed", e);
      layaScore = 0.5; // Neutral fail-safe
    }

    return this.prisma.smsTemplate.update({
      where: { id: templateId },
      data: {
        layaScore,
        isApproved: layaScore < 0.5,
      },
    });
  }

  async createCampaign(userId: number, name: string, templateId: number, csvUrl: string) {
    const template = await this.prisma.smsTemplate.findUnique({ where: { id: templateId } });
    if (!template || !template.isApproved) {
      throw new BadRequestException("Template must be approved before campaign creation");
    }

    let dataRows: any[] = [];
    try {
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      dataRows = parse(csvText, { columns: true, skip_empty_lines: true });
    } catch (e) {
      this.logger.error("Failed to parse CSV", e);
      throw new InternalServerErrorException("Failed to read or parse the uploaded CSV");
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        name,
        templateId,
        userId,
        status: "DRAFT",
      },
    });

    // Queue campaign in background
    this.queueCampaign(campaign.id, dataRows, template.content).catch((e) => {
      this.logger.error(`Error queueing campaign ${campaign.id}: ${e.message}`);
    });

    return campaign;
  }

  async queueCampaign(campaignId: number, dataRows: any[], templateStr: string) {
    this.logger.log(`Queueing campaign ${campaignId} with ${dataRows.length} rows`);

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "QUEUED", totalRows: dataRows.length },
    });

    for (const row of dataRows) {
      let message = templateStr;
      for (const [key, value] of Object.entries(row)) {
        message = message.replace(new RegExp(`{${key}}`, "g"), String(value));
      }

      const phoneNumber = row.phone || row.phoneNumber || row.phone_number;
      if (!phoneNumber) continue;

      const smsJob = await this.prisma.smsJob.create({
        data: {
          campaignId,
          phoneNumber,
          payload: { message },
        },
      });

      await this.smsQueue.add("send-sms", {
        campaignId,
        jobId: Number(smsJob.id),
        phoneNumber: smsJob.phoneNumber,
        payload: { message },
      });
    }

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "SENDING" },
    });
  }

  // ── Admin reads (staff oversight; guarded by RolesGuard ADMIN) ──

  async updateTemplate(id: number, body: UpdateTemplateDto) {
    const existing = await this.prisma.smsTemplate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Template not found");

    const contentChanged =
      body.content !== undefined && body.content.trim() !== existing.content.trim();

    // Editing the wording invalidates the Laya compliance score — re-evaluate before use.
    const resetCompliance = contentChanged && body.isApproved === undefined;

    const template = await this.prisma.smsTemplate.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        content: body.content ?? undefined,
        ...(resetCompliance ? { layaScore: null, isApproved: false } : {}),
        ...(body.isApproved !== undefined ? { isApproved: body.isApproved } : {}),
      },
    });

    return { ...template, complianceInvalidated: resetCompliance };
  }

  async retryFailedJobs(id: number) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException("Campaign not found");

    const failed = await this.prisma.smsJob.findMany({
      where: { campaignId: id, status: "FAILED" },
      select: { id: true, phoneNumber: true, payload: true },
    });

    if (failed.length === 0) return { retried: 0 };

    await this.prisma.smsJob.updateMany({
      where: { campaignId: id, status: "FAILED" },
      data: { status: "PENDING", error: null },
    });

    for (const job of failed) {
      const payload = job.payload as { message?: string } | null;
      await this.smsQueue.add("send-sms", {
        campaignId: id,
        jobId: Number(job.id),
        phoneNumber: job.phoneNumber,
        payload: { message: payload?.message ?? "" },
      });
    }

    await this.prisma.campaign.update({
      where: { id },
      data: { status: "SENDING" },
    });

    this.logger.log(`Re-queued ${failed.length} failed job(s) for campaign ${id}`);
    return { retried: failed.length };
  }

  async listTemplates(query: TemplateListQueryDto) {
    const take = Math.min(query.limit ?? 20, 100);
    const skip = ((query.page ?? 1) - 1) * take;
    const where: Record<string, unknown> = {};
    if (query.approved !== undefined) where.isApproved = query.approved === "true";
    if (typeof query.search === "string" && query.search.trim()) {
      const contains = { contains: query.search.trim(), mode: "insensitive" as const };
      where.OR = [{ name: contains }, { content: contains }];
    }
    const [data, total] = await Promise.all([
      this.prisma.smsTemplate.findMany({
        where,
        take,
        skip,
        orderBy: { id: "desc" },
        include: {
          user: { select: { id: true, email: true } },
          _count: { select: { campaigns: true } },
        },
      }),
      this.prisma.smsTemplate.count({ where }),
    ]);
    return { data, total };
  }

  async listCampaigns(query: CampaignListQueryDto) {
    const take = Math.min(query.limit ?? 20, 100);
    const skip = ((query.page ?? 1) - 1) * take;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        take,
        skip,
        orderBy: { id: "desc" },
        include: {
          template: { select: { id: true, name: true } },
          user: { select: { id: true, email: true } },
          _count: { select: { smsJobs: true } },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);
    return { data, total };
  }

  async getCampaign(id: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        template: { select: { id: true, name: true, content: true, isApproved: true } },
        user: { select: { id: true, email: true } },
        _count: { select: { smsJobs: true } },
      },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");
    const [statusBreakdown, failedJobs] = await Promise.all([
      this.prisma.smsJob.groupBy({
        by: ["status"],
        where: { campaignId: id },
        _count: { status: true },
      }),
      this.prisma.smsJob.findMany({
        where: { campaignId: id, status: "FAILED" },
        orderBy: { id: "desc" },
        take: 20,
        select: { id: true, phoneNumber: true, error: true, createdAt: true },
      }),
    ]);
    // sms_jobs.id is BIGINT — normalise to Number so the response stays JSON-safe.
    const safeFailedJobs = failedJobs.map((job) => ({ ...job, id: Number(job.id) }));
    return { data: campaign, statusBreakdown, failedJobs: safeFailedJobs };
  }

  async getCampaignAnalytics(id: number, query: CampaignAnalyticsQueryDto) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      select: { id: true, totalRows: true, processedRows: true, failedRows: true },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");

    // Whitelisted — never interpolated from raw input.
    const gran = query.granularity === "day" ? "day" : "hour";
    const buckets = await this.prisma.$queryRaw<{ t: Date; sent: number; failed: number }[]>`
      SELECT date_trunc(${gran}, "createdAt") AS t,
        COUNT(*) FILTER (WHERE status = 'SENT')::int AS sent,
        COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed
      FROM sms_jobs
      WHERE "campaignId" = ${id}
      GROUP BY 1
      ORDER BY 1
    `;
    const topErrors = await this.getTopErrors(id);

    const sent = buckets.reduce((n, b) => n + Number(b.sent), 0);
    const failed = buckets.reduce((n, b) => n + Number(b.failed), 0);
    const total = campaign.totalRows || sent + failed;
    return {
      rates: {
        total,
        sent,
        failed,
        pending: Math.max(total - sent - failed, 0),
        sentRate: total ? sent / total : 0,
        failedRate: total ? failed / total : 0,
      },
      buckets: buckets.map((b) => ({
        t: b.t,
        sent: Number(b.sent),
        failed: Number(b.failed),
      })),
      topErrors: topErrors.map((e) => ({ error: e.error, count: e._count.error })),
    };
  }

  async scheduleCampaign(id: number, body: ScheduleCampaignDto) {
    return this.prisma.campaign.update({
      where: { id },
      data: {
        sendAt: body.sendAt ? new Date(body.sendAt) : undefined,
        name: body.name ?? undefined,
      },
    });
  }

  private async getTopErrors(campaignId: number) {
    return this.prisma.smsJob.groupBy({
      by: ["error"],
      where: { campaignId, status: "FAILED", error: { not: null } },
      _count: { error: true },
      orderBy: { _count: { error: "desc" } },
      take: 5,
    });
  }

  async getAdvancedAnalytics(id: number, query: AdvancedAnalyticsQueryDto) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      select: { id: true, totalRows: true, processedRows: true, failedRows: true },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");

    const gran = query.granularity === "day" ? "day" : "hour";
    const buckets = await this.prisma.$queryRaw<{ t: Date; sent: number; failed: number }[]>`
      SELECT date_trunc(${gran}, "createdAt") AS t,
        COUNT(*) FILTER (WHERE status = 'SENT')::int AS sent,
        COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed
      FROM sms_jobs
      WHERE "campaignId" = ${id}
      GROUP BY 1
      ORDER BY 1
    `;

    const optOuts = await this.prisma.optOut.count({
      where: { campaignId: id },
    });

    const topErrors = await this.getTopErrors(id);

    // Simple segment & cost estimate:
    // Assume each SMS is one segment unless UCS-2 (then 70 chars vs 160). We'll estimate
    // cost per segment as $0.01 (configurable). Total segments ≈ totalRows (one seg per msg).
    const costPerSegment = 0.01; // $0.01 per SMS segment
    const estimatedSegments = campaign.totalRows || 0;
    const costEstimate = Math.round(estimatedSegments * costPerSegment * 100) / 100; // round to cents

    const sent = buckets.reduce((n, b) => n + Number(b.sent), 0);
    const failed = buckets.reduce((n, b) => n + Number(b.failed), 0);
    const total = campaign.totalRows || sent + failed;

    return {
      rates: {
        total,
        sent,
        failed,
        pending: Math.max(total - sent - failed, 0),
        sentRate: total ? sent / total : 0,
        failedRate: total ? failed / total : 0,
        optOutRate: total ? optOuts / total : 0,
      },
      buckets: buckets.map((b) => ({
        t: b.t,
        sent: Number(b.sent),
        failed: Number(b.failed),
      })),
      topErrors: topErrors.map((e) => ({ error: e.error, count: e._count.error })),
      engagement: {
        sentRate: total ? sent / total : 0,
        failedRate: total ? failed / total : 0,
        optOutRate: total ? optOuts / total : 0,
      },
      costEstimate,
    };
  }

  async getOverview() {
    const [templates, templatesApproved, campaigns, campaignsByStatus, jobsByStatus] =
      await Promise.all([
        this.prisma.smsTemplate.count(),
        this.prisma.smsTemplate.count({ where: { isApproved: true } }),
        this.prisma.campaign.count(),
        this.prisma.campaign.groupBy({ by: ["status"], _count: { status: true } }),
        this.prisma.smsJob.groupBy({ by: ["status"], _count: { status: true } }),
      ]);
    return { templates, templatesApproved, campaigns, campaignsByStatus, jobsByStatus };
  }
}
