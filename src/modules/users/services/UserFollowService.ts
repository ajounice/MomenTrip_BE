import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '@/modules/users/entities/Follow';
import { UserService } from '@/modules/users/services/UserService';
import { BadRequestException, NotFoundException } from '@/common/exceptions';

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
        const follower = await this.userService.findById(userId); //주체(follower)
        const followed = await this.userService.findByNickname(otherUser); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const isFollowed = await this.followRepository.findOne({
            where: { follower: follower, following: followed },
        });

        if (isFollowed) {
            throw new BadRequestException();
        }
        const follow = new Follow();
        follow.follower = follower;
        follow.following = followed;

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

    async getAllFollower(nickname: string): Promise<Follow[]> {
        const user = await this.userService.findByNickname(nickname);
        console.log(user);
        if (!user) {
            throw new NotFoundException();
        }
        return await this.followRepository.find({
            where: { following: user },
            relations: ['follower'],
        });
    }

    async getAllFollowing(nickname: string): Promise<Follow[]> {
        const user = await this.userService.findByNickname(nickname);
        if (!user) {
            throw new NotFoundException();
        }
        return await this.followRepository.find({
            where: { follower: user },
            relations: ['following'],
        });
    }
}
