import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '@/modules/users/entities/Follow';
import { UserService } from '@/modules/users/services/UserService';
import { BadRequestException, ForbiddenException, NotFoundException } from '@/common/exceptions';

@Injectable()
export class UserFollowService {
    constructor(
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>,
        private readonly userService: UserService,
    ) {}

    async follow(userId: number, otherUser: string) {
        //대상 존재 체크
        const isProvided = await this.userService.findNickname(otherUser);
        if (!isProvided) {
            throw new NotFoundException();
        }
        console.log('follow service 1');
        const follower = await this.userService.findById(userId); //주체(follower)
        const followed = await this.userService.findByNickname(otherUser); //대상(following)

        if (follower.id === followed.id) {
            console.log('뭐지 ?');
            throw new BadRequestException();
        }

        console.log('follow service 2');
        const isFollowed = await this.followRepository.findOne({
            where: { follower: follower, following: followed },
        });

        if (isFollowed) {
            throw new BadRequestException();
        }
        const follow = new Follow();
        follow.follower = follower;
        follow.following = followed;

        console.log('follow service 3');
        return await this.followRepository.save(follow);
    }

    async unFollow(userId: number, otherUser: string) {
        const isProvided = await this.userService.findNickname(otherUser);
        if (!isProvided) {
            throw new NotFoundException();
        }

        const follower = await this.userService.findById(userId); //주체(follower)
        const followed = await this.userService.findByNickname(otherUser); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const follow = await this.followRepository.findOne({
            where: { follower: follower, following: followed },
        });

        if (!follow) {
            throw new BadRequestException();
        }

        return await this.followRepository.remove(follow);
    }
}
