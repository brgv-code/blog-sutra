import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => String)
  id!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name?: string;
}
