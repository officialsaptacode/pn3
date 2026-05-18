import { ConflictException, Injectable } from "@nestjs/common";
import { EmailService } from "@/email/email.service";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { SendNewsletterDto } from "./dto/send-newsletter.dto";

@Injectable()
export class SubscribersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateSubscriberDto) {
    try {
      const subscriber = await this.prisma.subscriber.create({
        data: {
          email: dto.email,
        },
      });
      return subscriber;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictException("Email already subscribed");
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async sendNewsletter(dto: SendNewsletterDto) {
    // 1. Fetch all active subscribers
    const subscribers = await this.prisma.subscriber.findMany({
      where: { isActive: true },
    });

    // 2. Send email to each (in parallel or batch - simple loop for now)
    // Ideally use a queue (BullMQ) for large lists.
    const results = await Promise.allSettled(
      subscribers.map((sub) => this.emailService.sendEmail(sub.email, dto.subject, dto.message)),
    );

    const sentCount = results.filter((r) => r.status === "fulfilled").length;

    return {
      message: "Newsletter processing started",
      totalSubscribers: subscribers.length,
      sentCount,
    };
  }
}
