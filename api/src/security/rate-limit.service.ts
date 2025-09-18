import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RateLimitService {
  private readonly MAX_ATTEMPTS = 3;
  private readonly WINDOW_SIZE = 60 * 60 * 1000;
  constructor(private readonly prisma: PrismaService) {}
  async checkRateLimit(identifier: string, action: string): Promise<boolean> {
    const entry = await this.prisma.client.rateLimitEntry.findUnique({
      where: { identifier_action: { identifier, action } },
    });
    const now = new Date();

    if (!entry) {
      await this.createRateLimitEntry(identifier, action, now);
      return true;
    }

    if (now > entry.expiresAt) {
      this.resetRateLimitEntry(entry.id, now);
      return true;
    }

    if (entry.attempts >= this.MAX_ATTEMPTS) {
      return false;
    }

    await this.incrementAttempts(entry.id);
    return true;
  }
  private async createRateLimitEntry(
    identifier: string,
    action: string,
    now: Date
  ) {
    return this.prisma.client.rateLimitEntry.create({
      data: {
        identifier,
        action,
        attempts: 1,
        windowStart: now,
        expiresAt: new Date(now.getTime() + this.WINDOW_SIZE),
      },
    });
  }

  private async resetRateLimitEntry(id: string, now: Date) {
    return this.prisma.client.rateLimitEntry.update({
      where: { id },
      data: {
        attempts: 1,
        windowStart: now,
        expiresAt: new Date(now.getTime() + this.WINDOW_SIZE),
      },
    });
  }

  private async incrementAttempts(id: string) {
    return this.prisma.client.rateLimitEntry.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    });
  }
}
