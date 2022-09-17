import { NotFoundException } from '@/common/exceptions';
import { CreateUserInfoDto, UpdateUserInfoDto } from '@/modules/users/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';
import { UserService } from '@/modules/users/services/UserService';

export interface IBadgeCount {
    name: string;
    value: number;
}

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly commonService: CommonService,
        private readonly userService: UserService,
    ) {}

    private tagList = ['sea', 'mountain', 'hotel', 'camping', 'activity', 'festival', 'night'];

    private getBadgeCount(user: User): IBadgeCount[] {
        let total = 0;
        const tags = new Map();

        user.forms.forEach((form) => {
            for (const tag of form.tags) {
                if (this.tagList.includes(tag.name)) {
                    if (tags.has(tag.name)) {
                        tags.set(tag.name, tags.get(tag.name) + 1);
                    } else {
                        tags.set(tag.name, 1);
                    }
                }
            }
        });

        tags.forEach((v) => {
            total += v;
        });

        const data = Array.from(tags).map((tag) => ({ name: tag[0], value: tag[1] }));

        data.push({ name: 'total', value: total });

        data.sort((a, b) => b.value - a.value);

        return data;
    }

    async getUserProfileById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['forms', 'forms.tags'],
        });

        if (!user) {
            throw new NotFoundException();
        }

        user.badgeList = this.getBadgeCount(user);

        return user;
    }

    async getUserProfile(nickname: string) {
        const user = await this.userRepository.findOne({
            where: { nickname },
            relations: ['forms', 'forms.tags'],
        });
        if (!user) {
            throw new NotFoundException();
        }

        user.badgeList = this.getBadgeCount(user);
        return user;
    }

    async createUserProfile(id: number, createUserInfoDto: CreateUserInfoDto) {
        const isDuplicated = await this.userService.findNickname(createUserInfoDto.nickname);
        if (isDuplicated) {
            console.log('duplicated nickname');
            throw new BadRequestException();
        } else {
            await this.userRepository.update(id, createUserInfoDto);
            return this.getUserProfileById(id);
        }
    }

    async updateUserProfile(id: number, updateUserInfoDto: UpdateUserInfoDto) {
        const isDuplicated = await this.userService.findNickname(updateUserInfoDto.nickname);
        if (isDuplicated) {
            throw new BadRequestException();
        } else {
            await this.userRepository.update(id, updateUserInfoDto);
            return this.getUserProfileById(id);
        }
    }

    async updateProfileImage(id: number, file: Express.Multer.File) {
        const profileImage: string = await this.commonService.upload(file, 'images');
        await this.userRepository.update(id, { image: profileImage });
        return profileImage;
    }
}
