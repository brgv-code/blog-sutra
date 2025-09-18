import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
  private readonly TOKEN_LENGTH = 32;
  private readonly TOKEN_EXPIRY = 15 * 60 * 1000;

  async generateResetToken(): Promise<{
    token: string;
    tokenHash: string;
    expiresAt: Date;
  }> {
    const token = randomBytes(this.TOKEN_LENGTH).toString("hex");
    const tokenHash = await bcrypt.hash(token, 12);
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY);
    return { token, tokenHash, expiresAt };
  }

  async verifyToken(token: string, storedHash: string): Promise<boolean> {
    return bcrypt.compare(token, storedHash);
  }
}
