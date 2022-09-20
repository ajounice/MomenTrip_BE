import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@/AppModule';
import { ValidationPipe } from '@nestjs/common';

export const bootstrap = async (): Promise<NestExpressApplication> => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
