import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.info('NODE_ENV:', process.env.NODE_ENV);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '10mb' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // true일 경우 validation decorator가 붙어있지 않는 속성들은 제거
      forbidNonWhitelisted: false, // true일 경우 DTO에 존재하지 않는 값이 들어올 경우 에러, 이미지 경우 false로 해야 인식한다.
      transform: true, // 모든 데이터는 string으로 전달되는데 true일 경우 DTO에 도달할 때 형변환 시켜준다.
      stopAtFirstError: true, // 에러가 여러개일 경우 첫번째 메세지만 보내게 설정
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
