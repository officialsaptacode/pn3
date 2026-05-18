import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as nodemailer from "nodemailer";
import { EmailService } from "./email.service";

jest.mock("nodemailer");

describe("EmailService", () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === "SMTP_HOST") return "smtp.test.com";
              if (key === "SMTP_PORT") return 587;
              if (key === "SMTP_USER") return "user";
              if (key === "SMTP_PASS") return "pass";
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send an email", async () => {
    sendMailMock.mockResolvedValue({ messageId: "123" });
    await service.sendEmail("test@example.com", "Subject", "Body");
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: "Subject",
      }),
    );
  });
});
