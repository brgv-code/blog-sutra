import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TokenService } from "../../security/token.service";
import { EmailService } from "../email/email.service";
import { RateLimitService } from "../../security/rate-limit.service";
import bcrypt from "bcryptjs";
import { AppGraphQLError } from "../../common/errors/app-error";
import { ErrorCodes } from "../../common/errors/error-code";
@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly rateLimitService: RateLimitService
  ) {}
  //TODO: while creating password, hash it using userid to avoid same password hash
  async requestPasswordReset(email: string, ip: string, userAgent: string) {
    const identifier = email;
    const allowed = await this.rateLimitService.checkRateLimit(
      identifier,
      "password_reset+request"
    );
    if (!allowed) {
      await this.prisma.client.securityEvent.create({
        data: {
          eventType: "password_reset_rate_limited",
          ipAddress: ip,
          userAgent,
          success: false,
        },
      });
      throw new AppGraphQLError(
        "Too many password reset requests. Please try again later.",
        ErrorCodes.PASSWORD_RESET_RATE_LIMITED
      );
    }
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new AppGraphQLError("User not found", ErrorCodes.USER_NOT_FOUND);
    }

    const { token, tokenHash, expiresAt } =
      await this.tokenService.generateResetToken();
    await this.prisma.client.passwordReset.create({
      data: {
        userId: user.id,
        token,
        tokenHash,
        expiresAt,
        ipAddress: ip,
        userAgent,
      },
    });

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail(user.email, resetLink);
    await this.prisma.client.securityEvent.create({
      data: {
        userId: user.id,
        eventType: "password_reset_requested",
        ipAddress: ip,
        userAgent,
        success: true,
      },
    });
    return { message: "Password reset link sent if email exists" };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetEntry = await this.prisma.client.passwordReset.findFirst({
      where: { usedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!resetEntry) throw new Error("Invalid or expired token");
    const valid = await this.tokenService.verifyToken(
      token,
      resetEntry.tokenHash
    );
    if (!valid || resetEntry.expiresAt < new Date()) {
      throw new AppGraphQLError(
        "Invalid or expired token",
        ErrorCodes.PASSWORD_RESET_INVALID
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.prisma.client.account.updateMany({
      where: { userId: resetEntry.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.client.passwordReset.update({
      where: { id: resetEntry.id },
      data: { usedAt: new Date() },
    });

    await this.prisma.client.securityEvent.create({
      data: {
        userId: resetEntry.userId,
        eventType: "password_reset_complete",
        success: true,
      },
    });
  }
}
