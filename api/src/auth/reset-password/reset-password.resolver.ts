import { Resolver, Mutation, Args, Context } from "@nestjs/graphql";
import { PasswordResetService } from "./reset-password.service";
import { AppGraphQLError } from "../../common/errors/app-error";
import { ErrorCodes } from "../../common/errors/error-code";
@Resolver()
export class PasswordResolver {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Mutation(() => Boolean)
  async requestPasswordReset(
    @Args("email") email: string,
    @Context() context: any
  ): Promise<boolean> {
    const req = context.req;
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    try {
      await this.passwordResetService.requestPasswordReset(
        email,
        ip,
        userAgent
      );
      return true;
    } catch (err) {
      if (err instanceof AppGraphQLError) {
        throw err;
      }
      throw new AppGraphQLError(
        "Unexpected error",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args("token") token: string,
    @Args("newPassword") newPassword: string
  ): Promise<boolean> {
    await this.passwordResetService.resetPassword(token, newPassword);
    return true;
  }
}
