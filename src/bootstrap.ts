import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@/AppModule';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const bootstrap = async (): Promise<NestExpressApplication> => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Momentrip API Docs')
        .setDescription('Momentrip API Docs')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    app.disable('x-powered-by');

    app.enableCors({});

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //dto에 없는 property 값 거름
            forbidNonWhitelisted: true, //dto에 정의 안된 값 인입시 에러메세지
            transform: true, //controller가 값을 받을 때 형변환
        }),
    );

    return app;
};
