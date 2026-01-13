import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { join } from "node:path";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.use(cookieParser());
	app.use(helmet());
	app.enableCors({
		origin: ["http://localhost:3000", "http://localhost:5173"],
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
		.setTitle("SAAS API")
		.setDescription("The SAAS API description")
		.setVersion("1.0")
		.addTag("SAAS API")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, document);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	await app.listen(5000);
}
bootstrap();
