import { Resolver, Query } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "../types";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.users();
  }
}
