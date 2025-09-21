import { betterAuth } from "better-auth";
import { PrismaClient } from "../../../prisma/generated";
import { EmailService } from "./email/email.service";
const prisma = new PrismaClient();

export const auth = betterAuth({
  adapter: { prisma },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification:
      process.env.NODE_ENV === "production" ? true : false,
  },
  session: {
    fields: { expiresAt: "expiresAt", token: "token", userId: "userId" },
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});
