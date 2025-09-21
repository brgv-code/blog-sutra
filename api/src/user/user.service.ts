// api/src/user/user.service.ts (sketch)
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import bcrypt from "bcryptjs";
import { auth } from "../auth/betterauth";
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async users() {
    return this.prisma.client.user.findMany();
  }

  async meFromSession(req: any) {
    const sid = req.cookies?.sid;
    if (!sid) return null;
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });
      return session;
    } catch (error) {
      console.error("Session validation failed", error);
      return null;
    }
  }

  async register(email: string, password: string, name: string) {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    });
    if (!result.user.id) {
      console.error(result);
    }
    return result.token;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });
    console.log("email", user);
    if (!user) throw new Error("Invalid credentials");
    const result = await auth.api.signInEmail({
      body: { email, password },
    });
    console.log(result, "result");
    if (!result.token) console.error("login failed");
    return result.token;
  }

  async logout(req: Request) {
    try {
      const result = await auth.api.signOut({
        headers: req.headers,
      });
      return result;
    } catch (error) {
      console.error("Logout failed", error);
      return false;
    }
  }

  async updateUserProfile(
    userId: string,
    updates: { name?: string; image?: string }
  ) {
    const user = await this.prisma.client.user.update({
      where: { id: userId },
      data: updates,
    });

    return user;
  }
}
