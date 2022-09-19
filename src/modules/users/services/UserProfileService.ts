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

    public async getUserProfile(id: number) {
        const info = await this.userRepository.findOne({
            select: ['nickname', 'name', 'intro', 'type', 'image'],
            where: { id },
            relations: ['forms', 'forms.tags'],
        });

        info.badgeList = this.getBadgeCount(info);

        return info;
    }

    async createUserProfile(id: number, createUserInfoDto: CreateUserInfoDto) {
        const isDuplicated = await this.userService.checkNickname(createUserInfoDto.nickname);
        if (isDuplicated) {
            //중복
            throw new BadRequestException();
        }

        await this.userRepository.update(id, createUserInfoDto);

        return this.getUserProfile(id);
    }

    async updateUserProfile(id: number, updateUserInfoDto: UpdateUserInfoDto) {
        if (updateUserInfoDto.nickname !== undefined) {
            const isDuplicated = await this.userService.checkNickname(updateUserInfoDto.nickname);
            if (isDuplicated) {
                throw new BadRequestException();
            }
        }
        await this.userRepository.update(id, updateUserInfoDto);
        return this.getUserProfile(id);
    }

    async updateProfileImage(id: number, file: Express.Multer.File) {
        const profileImage: string = await this.commonService.upload(file, 'images');
        await this.userRepository.update(id, { image: profileImage });
        return profileImage;
    }
}
