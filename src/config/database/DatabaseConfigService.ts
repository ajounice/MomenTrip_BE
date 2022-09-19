import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Form, FormComment, FormLike } from '@/modules/forms/entities';
import { TourInfo, TourInfoLike, TourInfoComment } from '@/modules/tourInfos/entities';
import { User, UserStatistics, Badge, Follow } from '@/modules/users/entities';
import { Tag } from '@/modules/tags/entities/Tag';
import { WishlistItem } from '@/modules/wishlists/entities/WishlistItem';
import { WishlistFolder } from '@/modules/wishlists/entities';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    getEntities() {
        return [
            User,
            UserStatistics,
            Badge,
            Follow,
            Form,
            FormComment,
            FormLike,
            TourInfo,
            TourInfoLike,
            TourInfoComment,
            WishlistItem,
            WishlistFolder,
            Tag,
        ];
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            username: this.configService.get<string>('DATABASE_USER'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            port: +this.configService.get<number>('DATABASE_PORT'),
            host: this.configService.get<string>('DATABASE_HOST'),
            database: this.configService.get<string>('DATABASE_SCHEMA'),
            entities: this.getEntities(),
            namingStrategy: new SnakeNamingStrategy(),
            logging: this.configService.get<string>('NODE_ENV') !== 'production',
            synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
            legacySpatialSupport: false,
        };
    }
}
