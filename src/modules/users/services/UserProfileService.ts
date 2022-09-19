import { CreateUserInfoDto, UpdateUserInfoDto } from '@/modules/users/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';
import { UserService } from '@/modules/users/services/UserService';
import { UserFollowService } from '@/modules/users/services/UserFollowService';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly commonService: CommonService,
        private readonly userService: UserService,
    ) {}

    async getUserProfile(id: number) {
        const info = this.userRepository.findOne({
            select: ['nickname', 'name', 'intro', 'type', 'image'],
            where: { id },
        });
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
