import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const from = this.configService.get("SMTP_FROM") || '"Support" <support@example.com>';

      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error("Error sending email", error);
      throw error;
    }
  }
}
