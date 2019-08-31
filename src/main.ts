import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/hinto');
  app.useGlobalPipes(new ValidationPipe());

  const tipsOptions = new DocumentBuilder()
    .addTag('tips')
    .setBasePath('api/v1/hinto')
    .setHost(process.env.HOST_NAME || 'localhost')
    .build();
  const tipsDocument = SwaggerModule.createDocument(app, tipsOptions);
  SwaggerModule.setup('/docs', app, tipsDocument);

  await app.listen(3000);
}
bootstrap();
