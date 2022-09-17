import { NotFoundException } from '@/common/exceptions';
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
        private readonly userFollowService: UserFollowService,
    ) {}

    async getUserProfile(id: number) {
        const user = this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    async createUserProfile(id: number, createUserInfoDto: CreateUserInfoDto) {
        const isDuplicated = await this.userService.findNickname(createUserInfoDto.nickname);
        if (isDuplicated) {
            console.log('duplicated nickname');
            throw new BadRequestException();
        } else {
            await this.userRepository.update(id, createUserInfoDto);
            return this.getUserProfile(id);
        }
    }

    async updateUserProfile(id: number, updateUserInfoDto: UpdateUserInfoDto) {
        const isDuplicated = await this.userService.findNickname(updateUserInfoDto.nickname);
        if (isDuplicated) {
            throw new BadRequestException();
        } else {
            await this.userRepository.update(id, updateUserInfoDto);
            return this.getUserProfile(id);
        }
    }

    async updateProfileImage(id: number, file: Express.Multer.File) {
        const profileImage: string = await this.commonService.upload(file, 'images');
        await this.userRepository.update(id, { image: profileImage });
        return profileImage;
    }


}
