import { CreateUserInfoRequest, UpdateUserInfoRequest } from '@/modules/users/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';
import { UserService } from '@/modules/users/services/UserService';
import { BadRequestException, NotFoundException } from '@/common/exceptions';

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

    private tagList = [
        'sea',
        'mountain',
        'hotel',
        'camping',
        'activity',
        'festival',
        'night',
        '바다',
        '산',
        '숙소',
        '캠핑',
        '액티비티',
        '축제',
        '야경',
    ];

    private getBadgeCount(user: User): IBadgeCount[] {
        let total = 0;
        const tags = new Map();

        user.forms.forEach((form) => {
            for (const tag of form.tags) {
                const idx = this.tagList.findIndex((item) => tag.name === item);
                if (idx !== -1) {
                    if (tags.has(this.tagList[idx % 7])) {
                        tags.set(this.tagList[idx % 7], tags.get(this.tagList[idx % 7]) + 1);
                    } else {
                        tags.set(this.tagList[idx % 7], 1);
                    }
                }
                // if (this.tagList.includes(tag.name)) {
                //     if (tags.has(tag.name)) {
                //         tags.set(tag.name, tags.get(tag.name) + 1);
                //     } else {
                //         tags.set(tag.name, 1);
                //     }
                // }
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

    public async getProfile(id: number) {
        const info = await this.userRepository.findOne({
            where: { id },
            relations: ['forms', 'forms.tags'],
        });
        if (!info) {
            throw new NotFoundException();
        }
        info.badgeList = this.getBadgeCount(info);

        delete info.password;

        return info;
    }

    async createProfile(id: number, createUserInfoDto: CreateUserInfoRequest) {
        const isDuplicated = await this.userService.checkNickname(createUserInfoDto.nickname);
        if (isDuplicated) {
            //중복
            throw new BadRequestException();
        }

        await this.userRepository.update(id, createUserInfoDto);

        return this.getProfile(id);
    }

    async updateProfile(id: number, updateUserInfoDto: UpdateUserInfoRequest) {
        if (updateUserInfoDto.nickname) {
            const isDuplicated = await this.userService.checkNickname(updateUserInfoDto.nickname);
            if (isDuplicated) {
                throw new BadRequestException();
            }
        }
        await this.userRepository.update(id, updateUserInfoDto);
        return this.getProfile(id);
    }

    async updateProfileImage(id: number, file: Express.Multer.File) {
        const profileImage: string = await this.commonService.upload(file, 'images');
        await this.userRepository.update(id, { image: profileImage });
        return profileImage;
    }
}
