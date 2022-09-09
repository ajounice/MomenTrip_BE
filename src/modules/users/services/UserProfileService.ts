import { NotFoundException } from '@/common/exceptions';
import { CreateUserInfoDto, UpdateUserInfoDto } from '@/modules/users/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CommonService } from '@/modules/common/CommonService';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly commonService: CommonService,
    ) {}

    async getUserProfile(id: number) {
        const user = this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    async createUserProfile(id: number, createUserInfoDto: CreateUserInfoDto) {
        await this.userRepository.update(id, createUserInfoDto);
        return this.getUserProfile(id);
    }

    async updateUserProfile(id: number, updateUserInfoDto: UpdateUserInfoDto) {
        console.log(updateUserInfoDto.nickname);
        await this.userRepository.update(id, updateUserInfoDto);
        return this.getUserProfile(id);
    }

    async updateProfileImage(id: number, file: Express.Multer.File) {
        const profileImage: string = await this.commonService.upload(file, 'images');
        console.log({ profileImage });
        await this.userRepository.update(id, { image: profileImage });
        //return profileImage;
    }
}
