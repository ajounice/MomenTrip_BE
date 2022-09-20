import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '@/modules/users/entities/Follow';
import { UserService } from '@/modules/users/services/UserService';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { User } from '@/modules/users/entities';

@Injectable()
export class UserFollowService {
    constructor(
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
    ) {}

    async follow(userId: number, otherUser: string) {
        //대상 존재 체크
        const isProvided = await this.userService.checkNickname(otherUser);
        if (!isProvided) {
            throw new NotFoundException();
        }
        const follower = await this.userService.findById(userId); //주체(follower)
        const followed = await this.userService.findByNickname(otherUser); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const isFollowed = await this.followRepository.count({
            where: { follower: { id: userId }, following: { nickname: otherUser } },
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
        const isProvided = await this.userService.checkNickname(otherUser);
        if (!isProvided) {
            throw new NotFoundException();
        }

        const follower = await this.userService.findById(userId); //주체(follower)
        const followed = await this.userService.findByNickname(otherUser); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const follow = await this.followRepository.findOne({
            where: { follower: { id: userId }, following: { nickname: otherUser } },
        });


        if (!follow) {
            throw new BadRequestException();
        }

        return await this.followRepository.remove(follow);
    }

    async getAllFollower(nickname: string): Promise<User[]> {
        const target = await this.followRepository.find({
            where: { following: { nickname } },
            relations: ['follower'],
        });
        const users: User[] = target.map((target) => target.follower);
        return users;
    }

    async getAllFollowing(nickname: string): Promise<User[]> {
        const target = await this.followRepository.find({
            where: { follower: { nickname } },
            relations: ['following'],
        });
        const users: User[] = target.map((target) => target.following);
        return users;
    }

    async checkFollowing(userId: number, otherUser: string) {
        //대상 존재 체크
        const isProvided = await this.userService.checkNickname(otherUser);
        if (!isProvided) {
            throw new NotFoundException();
        }
        const follower = await this.userService.findById(userId); //주체(follower)
        const followed = await this.userService.findByNickname(otherUser); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const following = await this.followRepository.findOne({
            where: { follower: { id: userId }, following: { nickname: otherUser } },
        });

        if (following) {
            return true;
        }
        return false;
    }

    async checkFollower(userId: number, otherUser: string) {
        //대상 존재 체크
        const isProvided = await this.userService.checkNickname(otherUser);
        if (!isProvided) {
            throw new NotFoundException();
        }

        const follower = await this.userService.findByNickname(otherUser); //주체(follower)
        const followed = await this.userService.findById(userId); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const following = await this.followRepository.findOne({
            where: { follower: { nickname: otherUser }, following: { id: userId } },
        });

        if (following) {
            return true;
        }
        return false;
    }
}
