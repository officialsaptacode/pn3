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
import { assertPublicUrl, fetchPublicUrl } from "./csv-source";
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

    // System 1: Cloudflare CLEF spam detection (Jev/SystemOne-compatible POST /v1/systemone)
    let clefScore = 0.1;
    try {
      const score = await this.scoreSpamWithClef(template.content);
      if (score == null) {
        // Fallback mock logic if no server configured
        const isSpam = template.content.toLowerCase().includes("viagra");
        clefScore = isSpam ? 0.95 : 0.1;
        this.logger.warn("CLEF not configured, using fallback mock scoring");
      } else {
        clefScore = score;
        this.logger.log(`CLEF scored template ${templateId}: score=${clefScore}`);
      }
    } catch (e) {
      this.logger.error("CLEF evaluation failed", e);
      clefScore = 0.5; // Neutral fail-safe
    }

    return this.prisma.smsTemplate.update({
      where: { id: templateId },
      data: {
        spamScore: clefScore,
        isApproved: clefScore < 0.5,
      },
    });
  }

  async testClefSpamDetection(text: string) {
    try {
      const score = await this.scoreSpamWithClef(text);
      if (score == null) {
        this.logger.warn("CLEF test: Missing configuration, using fallback mock");
        const isSpam =
          text.toLowerCase().includes("viagra") || text.toLowerCase().includes("free money");
        const mockScore = isSpam ? 0.95 : 0.1;
        this.logger.log(`CLEF test spam detection operation successful (mock). Score=${mockScore}`);
        return { success: true, score: mockScore, isSpam, mock: true };
      }

      this.logger.log(`CLEF test spam detection operation successful. Score=${score}`);
      return { success: true, score, isSpam: score >= 0.5, mock: false };
    } catch (e) {
      this.logger.error("CLEF test spam detection operation failed", e);
      this.logger.log("CLEF test spam detection operation failed");
      return { success: false, error: String(e) };
    }
  }

  /**
   * Delivers a single SMS through the AkashSMS provider.
   * With DRY_RUN=true it only logs the message and never touches the provider.
   * Returns the provider message id when one is available.
   */
  async deliverSms(phoneNumber: string, message: string): Promise<string | undefined> {
    if (process.env.DRY_RUN === "true") {
      this.logger.log(`[DRY RUN] Would send SMS to ${phoneNumber}: ${message}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return undefined;
    }

    const authToken = process.env.AKASHSMS_AUTH_TOKEN;
    if (!authToken) throw new Error("Missing AKASHSMS_AUTH_TOKEN in environment");

    this.logger.log(`Sending SMS to ${phoneNumber} via AkashSMS API...`);
    const response = await fetch("https://aakashsms.com/admin/public/sms/v3/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_token: authToken, to: phoneNumber, text: message }),
    });

    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`AkashSMS API Error: ${response.status} - ${errData}`);
    }

    try {
      const ack = await response.json();
      return ack?.data?.message_id ?? ack?.message_id ?? undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Temporary test API: spam-checks a message with CLEF and only delivers it
   * when it passes. Logs the outcome to the console either way.
   */
  async testSendSms(phoneNumber: string, message: string) {
    const result = {
      success: false,
      blocked: false,
      score: null as number | null,
      isSpam: false,
      providerMessageId: undefined as string | undefined,
      message: "",
      error: undefined as string | undefined,
    };

    try {
      const score = await this.scoreSpamWithClef(message);
      result.score = score;

      if (score == null) {
        result.error =
          "CLEF is not configured - set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN";
        result.message = "Test send operation failed";
        this.logger.error(`CLEF test send failed: ${result.error}`);
        return result;
      }

      result.isSpam = score >= 0.5;

      if (result.isSpam) {
        this.logger.warn(
          `CLEF test send blocked as spam: phone=${phoneNumber} score=${score} message=${message}`,
        );
        result.blocked = true;
        result.message = "Message blocked by CLEF spam detection";
        return result;
      }

      const providerMessageId = await this.deliverSms(phoneNumber, message);
      result.providerMessageId = providerMessageId;
      result.success = true;
      result.message = "Message sent successfully";
      this.logger.log(
        `CLEF test send successful: phone=${phoneNumber} score=${score} message=${message}`,
      );
      return result;
    } catch (e) {
      this.logger.error(`CLEF test send failed: phone=${phoneNumber}`, e);
      result.error = e instanceof Error ? e.message : String(e);
      result.message = "Test send operation failed";
      return result;
    }
  }

  /**
   * Scores SMS text with Cloudflare CLEF. Returns null when the Cloudflare
   * environment variables are not configured, so callers can fall back.
   */
  private async scoreSpamWithClef(text: string): Promise<number | null> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const base = (process.env.CLOUDFLARE_AI_BASE_URL || "").replace(/\/+$/, "");
    if (!accountId || !apiToken || !base) return null;

    // Workers AI run endpoint for the CLEF decision model.
    const url = `${base}/${accountId}/ai/run/@cf/cloudflare/clef`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        state: { document: text },
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
    if (!response.ok) throw new Error(`CLEF server responded ${response.status}`);

    const data = await response.json();
    const answer = data?.result?.answers?.spam_check;
    // "A" is the spam option, so probabilities.A is the probability it is spam.
    const probability = answer?.probabilities?.A;
    if (typeof probability === "number") return probability;

    const choice = String(answer?.choice ?? "").toLowerCase();
    const isSpam = choice === "a" || choice.startsWith("yes") || choice.includes("spam");
    const confidence = typeof answer?.confidence === "number" ? answer.confidence : null;
    return confidence != null ? (isSpam ? confidence : 1 - confidence) : isSpam ? 0.9 : 0.1;
  }

  /**
   * Creates a campaign.
   *
   * The audience CSV can be supplied as a URL or as inline text. When the CSV
   * is readable at creation time the campaign is queued straight away; when it
   * is not (for example an S3 bucket that is not configured yet) the campaign
   * is still saved as DRAFT so it can be sent later from the admin panel.
   */
  async createCampaign(
    userId: number,
    name: string,
    templateId: number,
    csvUrl?: string | null,
    csvText?: string | null,
    sendAt?: string | null,
  ) {
    const template = await this.prisma.smsTemplate.findUnique({ where: { id: templateId } });
    if (!template || !template.isApproved) {
      throw new BadRequestException("Template must be approved before campaign creation");
    }
    if (!csvUrl && !csvText) {
      throw new BadRequestException("A CSV file or CSV URL is required");
    }

    const { csvRows, readable } = await this.readAudienceAtCreation(csvUrl, csvText);
    const scheduledFor = sendAt ? new Date(sendAt) : null;

    const campaign = await this.prisma.campaign.create({
      data: {
        name,
        templateId,
        userId,
        status: "DRAFT",
        sendAt: scheduledFor,
        csvUrl: csvUrl ?? null,
        csvText: csvText ?? null,
        totalRows: csvRows.length,
      },
    });

    // Only auto-send when the audience was readable at creation time.
    if (readable) {
      await this.queueCampaign(campaign.id, csvRows, template.content, scheduledFor);
    }

    return campaign;
  }

  /**
   * Reads the audience CSV at creation time.
   *
   * Inline text is authoritative: an empty CSV is a hard error. A URL that
   * cannot be read is not - the campaign is still created and saved as DRAFT.
   */
  private async readAudienceAtCreation(
    csvUrl?: string | null,
    csvText?: string | null,
  ): Promise<{ csvRows: any[]; readable: boolean }> {
    if (csvText) {
      const csvRows = parse(csvText, { columns: true, skip_empty_lines: true });
      if (csvRows.length === 0) {
        throw new BadRequestException("The CSV has no data rows");
      }
      return { csvRows, readable: true };
    }

    if (!csvUrl) return { csvRows: [], readable: false };

    // Rejects private/internal targets before anything is fetched.
    await assertPublicUrl(csvUrl);

    try {
      const response = await fetchPublicUrl(csvUrl);
      if (!response.ok) return { csvRows: [], readable: false };
      const csvRows = parse(await response.text(), { columns: true, skip_empty_lines: true });
      return { csvRows, readable: csvRows.length > 0 };
    } catch {
      this.logger.warn(`CSV not reachable at creation, saving campaign as draft: ${csvUrl}`);
      return { csvRows: [], readable: false };
    }
  }

  /** Reads the audience rows from the campaign's stored CSV (inline text or URL). */
  private async loadCsvRows(source: {
    csvUrl?: string | null;
    csvText?: string | null;
  }): Promise<any[]> {
    if (source.csvText) {
      return parse(source.csvText, { columns: true, skip_empty_lines: true });
    }
    if (!source.csvUrl) {
      throw new BadRequestException("Campaign has no CSV to read");
    }

    try {
      const response = await fetchPublicUrl(source.csvUrl);
      if (!response.ok) throw new Error(`CSV request failed with status ${response.status}`);
      return parse(await response.text(), { columns: true, skip_empty_lines: true });
    } catch (e) {
      this.logger.error("Failed to parse CSV", e);
      throw new InternalServerErrorException("Failed to read or parse the uploaded CSV");
    }
  }

  async queueCampaign(
    campaignId: number,
    dataRows: any[],
    templateStr: string,
    sendAt?: Date | null,
  ) {
    this.logger.log(`Queueing campaign ${campaignId} with ${dataRows.length} rows`);

    // A future sendAt means BullMQ holds the jobs until then instead of sending now.
    const delay = sendAt ? Math.max(0, sendAt.getTime() - Date.now()) : 0;

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

      // Deterministic BullMQ job id so a schedule change can remove and re-add it.
      await this.smsQueue.add(
        "send-sms",
        {
          campaignId,
          jobId: Number(smsJob.id),
          phoneNumber: smsJob.phoneNumber,
          payload: { message },
        },
        { delay, jobId: `sms-${smsJob.id}` },
      );
    }

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: delay > 0 ? "SCHEDULED" : "SENDING" },
    });
  }

  // ── Admin reads (staff oversight; guarded by RolesGuard ADMIN) ──

  async updateTemplate(id: number, body: UpdateTemplateDto) {
    const existing = await this.prisma.smsTemplate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Template not found");

    const contentChanged =
      body.content !== undefined && body.content.trim() !== existing.content.trim();

    // Editing the wording invalidates the spam score — re-evaluate before use.
    const resetCompliance = contentChanged && body.isApproved === undefined;

    const template = await this.prisma.smsTemplate.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        content: body.content ?? undefined,
        ...(resetCompliance ? { spamScore: null, isApproved: false } : {}),
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
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: { template: true },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");

    const alreadySent = await this.prisma.smsJob.count({
      where: { campaignId: id, status: "SENT" },
    });
    if (alreadySent > 0) {
      throw new BadRequestException(
        "Campaign has already started sending and can no longer be rescheduled",
      );
    }

    // No sendAt means "send now": re-queue the pending jobs without a delay.
    const sendAt = body.sendAt ? new Date(body.sendAt) : null;
    const delay = sendAt ? Math.max(0, sendAt.getTime() - Date.now()) : 0;

    const pending = await this.prisma.smsJob.findMany({
      where: { campaignId: id, status: "PENDING" },
      select: { id: true, phoneNumber: true, payload: true },
    });

    // A campaign that was never sent has no jobs yet - build them from its CSV.
    if (pending.length === 0) {
      const dataRows = await this.loadCsvRows(campaign);
      await this.queueCampaign(id, dataRows, campaign.template.content, sendAt);
      return this.prisma.campaign.update({
        where: { id },
        data: { sendAt, name: body.name ?? undefined },
      });
    }

    for (const job of pending) {
      const queueJobId = `sms-${job.id}`;
      // Removing a job that is already being processed throws; the re-add is then a no-op.
      await this.smsQueue.remove(queueJobId).catch(() => undefined);
      await this.smsQueue.add(
        "send-sms",
        {
          campaignId: id,
          jobId: Number(job.id),
          phoneNumber: job.phoneNumber,
          payload: job.payload,
        },
        { delay, jobId: queueJobId },
      );
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        sendAt,
        name: body.name ?? undefined,
        status: delay > 0 ? "SCHEDULED" : "SENDING",
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
