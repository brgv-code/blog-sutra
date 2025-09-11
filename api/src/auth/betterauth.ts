import { betterAuth } from "better-auth";
import { PrismaClient } from "../../../prisma/generated";
const prisma = new PrismaClient();

export const auth = betterAuth({
  adapter: { prisma },
  session: {
    fields: { expiresAt: "expiresAt", token: "token", userId: "userId" },
    maxAge: 60 * 60 * 24 * 30,
  },
});
