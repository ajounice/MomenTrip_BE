import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '@/modules/follows/entities/Follow';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>,
    ) {}

    async unFollow(id: any, other: string) {
        return Promise.resolve(undefined);
    }

    async follow(id: any, other: string) {
        return Promise.resolve(undefined);
    }
}
