import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(helmet())
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  })

  app.useStaticAssets(join(__dirname, '..', 'public/files'), {
    prefix: '/public/files/',
  })

  const config = new DocumentBuilder()
    .setTitle('PN3')
    .setDescription('The PN3 description')
    .setVersion('1.0')
    .addTag('PN3')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  await app.listen(5000)
}
bootstrap()
