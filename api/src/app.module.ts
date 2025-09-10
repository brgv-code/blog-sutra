import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { join } from "path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      autoSchemaFile: join(process.cwd(), "schema.gql"),
      sortSchema: true,
      playground: true,
      introspection: true,
     
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
