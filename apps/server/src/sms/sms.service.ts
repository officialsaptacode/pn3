import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/prisma/prisma.service';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET || 'test-bucket';

  constructor(
    @InjectQueue('sms-queue') private smsQueue: Queue,
    private prisma: PrismaService,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
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
    // Generate AI content (System 2 Mock)
    const aiEnhancedContent = content; // In reality, we'd call OpenAI here
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
    if (!template) throw new BadRequestException('Template not found');

    // System 1 Mock (Laya spam checker)
    const isSpam = template.content.toLowerCase().includes('viagra');
    const layaScore = isSpam ? 0.95 : 0.1;
    
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
      throw new BadRequestException('Template must be approved before campaign creation');
    }

    let dataRows: any[] = [];
    try {
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      dataRows = parse(csvText, { columns: true, skip_empty_lines: true });
    } catch (e) {
      this.logger.error('Failed to parse CSV', e);
      throw new InternalServerErrorException('Failed to read or parse the uploaded CSV');
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        name,
        templateId,
        userId,
        status: 'DRAFT',
      },
    });

    // Queue campaign in background
    this.queueCampaign(campaign.id, dataRows, template.content).catch(e => {
      this.logger.error(`Error queueing campaign ${campaign.id}: ${e.message}`);
    });

    return campaign;
  }

  async queueCampaign(campaignId: number, dataRows: any[], templateStr: string) {
    this.logger.log(`Queueing campaign ${campaignId} with ${dataRows.length} rows`);
    
    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'QUEUED', totalRows: dataRows.length }
    });

    for (const row of dataRows) {
      let message = templateStr;
      for (const [key, value] of Object.entries(row)) {
        message = message.replace(new RegExp(`{${key}}`, 'g'), String(value));
      }

      const phoneNumber = row.phone || row.phoneNumber || row.phone_number;
      if (!phoneNumber) continue;

      const smsJob = await this.prisma.smsJob.create({
        data: {
          campaignId,
          phoneNumber,
          payload: { message }
        }
      });

      await this.smsQueue.add('send-sms', {
        campaignId,
        jobId: smsJob.id,
        phoneNumber: smsJob.phoneNumber,
        payload: { message }
      });
    }
    
    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'SENDING' }
    });
  }
}
