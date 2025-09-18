import {
  Controller,
  Post,
  Body,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { RateLimitService } from "../../security/rate-limit.service";
import { PasswordResetService } from "./reset-password.service";
import { RequestResetDto } from "./dto/request-reset.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
@Controller("auth")
export class PasswordResetController {
  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly passwordResetService: PasswordResetService
  ) {}

  @Post("request-reset")
  async requestReset(@Body() dto: RequestResetDto, @Req() req: Request) {
    const ip = req.headers.get("ip"); // check if headers has ip or not
    const userAgent = req.headers.get("user-agent") || "unknown";
    const allowed = await this.rateLimitService.checkRateLimit(
      dto.email,
      "password_reset_request"
    );
    if (!allowed)
      throw new BadRequestException("Too many requests. Try again later.");

    const token = await this.passwordResetService.requestPasswordReset(
      dto.email,
      ip ?? "",
      userAgent
    );

    console.log(
      `Send email link" https"//sutra.com/reset-password?token=${token}`
    );
    return { message: "Password reset sent if email exists" };
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      await this.passwordResetService.resetPassword(dto.token, dto.newPassword);
      return { message: "Password reset successful. Login with new Password" };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException("Unknown error");
    }
  }
}
