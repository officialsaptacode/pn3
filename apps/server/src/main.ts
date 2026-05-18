import "./instrument";
import { join } from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Trust proxy for Railway/Proxies to handle secure cookies correctly
  app.set("trust proxy", true);

  console.log("-----------------------------------------");
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`CORS_ORIGIN: ${configService.get("CORS_ORIGIN")}`);
  console.log(`PORT: ${configService.get("PORT")}`);
  console.log("-----------------------------------------");

  app.use(helmet());
  // parse cookies so RtStrategy can read httpOnly refresh tokens
  app.use(cookieParser());

  const corsOrigin = configService.get<string>("CORS_ORIGIN");

  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(",").map((o) => o.trim()) : true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, "..", "public/files"), {
    prefix: "/public/files/",
  });

  const config = new DocumentBuilder()
    .setTitle("Project Travels API")
    .setDescription("The Project Travels API description")
    .setVersion("1.0")
    .addTag("Project Travels API")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix("api");

  await app.listen(5000);
}
bootstrap();
