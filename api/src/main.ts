import "reflect-metadata";
import { NestExpressApplication } from "./../node_modules/@nestjs/platform-express/interfaces/nest-express-application.interface.d";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  });
  app.use(cookieParser());
  app.useBodyParser("json", { limit: "10mb" });
  const config = new DocumentBuilder()
    .setTitle("LouraAPI")
    .setDescription("API for the Loura App")
    .setVersion("0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(3001);

  console.log("🚀 Server running at http://localhost:3001/graphql");
}
bootstrap();
