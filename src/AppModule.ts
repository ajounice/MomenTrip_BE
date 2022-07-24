import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/users/UserModule';
import { FormModule } from '@/modules/forms/FormModule';
import { DatabaseConfigModule, DatabaseConfigService } from '@/config/database';
import { TagModule } from '@/modules/tags/TagModule';

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
        TagModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
