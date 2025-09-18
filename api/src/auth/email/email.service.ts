import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { MailerService } from "@nestjs-modules/mailer";
import { AppGraphQLError } from "../../common/errors/app-error";
import { ErrorCodes } from "../../common/errors/error-code";

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}
  async sendPasswordResetEmail(email: string, resetLink: string) {
    const fromAddress =
      process.env.FROM ||
      process.env.SMTP_USER ||
      process.env.GMAIL_USER ||
      "no-reply@sutra.local";
    try {
      const info = await this.mailer.sendMail({
        to: email,
        from: `"SUTRA" <${fromAddress}>`,
        subject: "Reset your password for Sutra",
        html: `
          <p>Hello,</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p>This link is valid for 15 minutes.</p>
        `,
      });
      const preview = nodemailer.getTestMessageUrl(info as any);
      if (preview) {
        console.log("Ethereal preview URL:", preview);
      } else {
        console.log(
          "Email sent:",
          (info as any)?.response || (info as any)?.messageId || info
        );
      }
    } catch (err) {
      console.error("Nodemailer error:", err);
      throw new AppGraphQLError(
        "Error while sending email",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
