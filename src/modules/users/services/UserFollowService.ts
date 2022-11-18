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

    async follow(myId: number, userNickname: string) {
        //대상 존재 체크
        const isProvided = await this.userService.checkNickname(userNickname);
        if (!isProvided) {
            throw new NotFoundException();
        }
        const follower = await this.userService.findById(myId); //주체(follower)
        const followed = await this.userService.findByNickname(userNickname); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const isFollowed = await this.followRepository.count({
            where: { follower: { id: myId }, following: { nickname: userNickname } },
        });

        if (isFollowed) {
            throw new BadRequestException();
        }
        const follow = new Follow();
        follow.follower = follower;
        follow.following = followed;

        return await this.followRepository.save(follow);
    }

    async unFollow(myId: number, userNickname: string) {
        const isProvided = await this.userService.checkNickname(userNickname);
        if (!isProvided) {
            throw new NotFoundException();
        }

        const follower = await this.userService.findById(myId); //주체(follower)
        const followed = await this.userService.findByNickname(userNickname); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const follow = await this.followRepository.findOne({
            where: { follower: { id: myId }, following: { nickname: userNickname } },
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

    async checkFollowing(myId: number, userNickname: string) {
        //대상 존재 체크
        const isProvided = await this.userService.checkNickname(userNickname);
        if (!isProvided) {
            throw new NotFoundException();
        }
        const follower = await this.userService.findById(myId); //주체(follower)
        const followed = await this.userService.findByNickname(userNickname); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const following = await this.followRepository.findOne({
            where: { follower: { id: myId }, following: { nickname: userNickname } },
        });

        if (following) {
            return true;
        }
        return false;
    }

    async checkFollower(myId: number, userNickname: string) {
        //대상 존재 체크
        const isProvided = await this.userService.checkNickname(userNickname);
        if (!isProvided) {
            throw new NotFoundException();
        }

        const follower = await this.userService.findByNickname(userNickname); //주체(follower)
        const followed = await this.userService.findById(myId); //대상(following)

        if (follower.id === followed.id) {
            throw new BadRequestException();
        }

        const following = await this.followRepository.findOne({
            where: { follower: { nickname: userNickname }, following: { id: myId } },
        });

        if (following) {
            return true;
        }
        return false;
    }
}
