// import { APP_PIPE } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/users/UserModule';
import { FormModule } from '@/modules/forms/FormModule';
import { TourInfoModule } from '@/modules/tourInfos/TourInfoModule';
import { DatabaseConfigModule, DatabaseConfigService } from '@/config/database';
import { AuthModule } from '@/modules/auth/AuthModule';
import { TagModule } from '@/modules/tags/TagModule';
// import { ValidationPipe } from '@/common/pipes';
import { LoggerMiddleware } from '@/common/middlewares';
import { CommonModule } from '@/modules/common/CommonModule';
import { WishlistModule } from '@/modules/wishlists/WishlistModule';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [DatabaseConfigModule],
            useClass: DatabaseConfigService,
            inject: [DatabaseConfigService],
        }),
        UserModule,
        FormModule,
        TourInfoModule,
        TagModule,
        TourInfoModule,
        AuthModule,
        CommonModule,
        WishlistModule,
    ],
    controllers: [],
    providers: [
        // {
        //     provide: APP_PIPE,
        //     useClass: ValidationPipe,
        // },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
