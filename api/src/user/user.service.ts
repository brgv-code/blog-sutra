// api/src/user/user.service.ts (sketch)
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async users() {
    return this.prisma.client.user.findMany();
  }

  async meFromSession(req: any) {
    const sid = req.cookies?.sid;
    if (!sid) return null;
    const session = await this.prisma.client.session.findUnique({
      where: { token: sid },
      include: { user: true },
    });
    return session ?? null;
  }

  async register(email: string, password: string, name?: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.client.user.create({
      data: { email, name, password: hash } as any,
    });
    const session = await this.prisma.client.session.create({
      data: {
        token: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
    return { user, sessionToken: session.token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { email } as any,
    });
    if (!user) throw new Error("Invalid credentials");
    const ok = await bcrypt.compare(password, (user as any).password ?? "");
    if (!ok) throw new Error("Invalid credentials");
    const session = await this.prisma.client.session.create({
      data: {
        token: crypto.randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
    return { user, sessionToken: session.token };
  }
}
