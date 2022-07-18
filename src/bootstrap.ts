import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@/AppModule';

export const bootstrap = async (): Promise<NestExpressApplication> => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.disable('x-powered-by');

    app.enableCors({});

    app.use(cookieParser());

    return app;
};
