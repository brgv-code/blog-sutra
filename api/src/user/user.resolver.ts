import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { Response, Request } from "express";
import { User } from "../types";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { nullable: true })
  async me(@Context() ctx: { req: Request }) {
    const session = await this.userService.meFromSession(ctx.req);
    return session?.user ?? null;
  }

  @Query(() => [User], { nullable: true })
  async users() {
    return this.userService.users();
  }
  @Mutation(() => Boolean)
  async register(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("name", { nullable: true }) name: string,
    @Context() ctx: { res: Response }
  ) {
    const token = await this.userService.register(email, password, name);

    ctx.res.cookie("sid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    return true;
  }

  @Mutation(() => Boolean)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
    @Context() ctx: { res: Response }
  ) {
    const token = await this.userService.login(email, password);
    ctx.res.cookie("sid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: { res: Response }) {
    ctx.res.clearCookie("sid", { path: "/" });
    return true;
  }
}
