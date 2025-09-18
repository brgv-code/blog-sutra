import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RateLimitService } from "../security/rate-limit.service";
import { TokenService } from "../security/token.service";
import { PasswordResetService } from "./reset-password/reset-password.service";
import { PasswordResetController } from "./reset-password/reset-password.controller";
import { PasswordResolver } from "./reset-password/reset-password.resolver";
import { EmailModule } from "./email/email.module";

@Module({
  controllers: [PasswordResetController],
  providers: [
    PrismaService,
    RateLimitService,
    TokenService,
    PasswordResetService,
    PasswordResolver,
  ],
  imports: [EmailModule],
})
export class AuthModule {}
