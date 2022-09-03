import { NotFoundException } from '@/common/exceptions';
import { UpdateUserDto } from '@/modules/users/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async show(id: number) {
        const user = this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = this.userRepository.findOne({ where: { id } });
        console.log(updateUserDto.nickname);
        /*if (user) {
        await this.userRepository.save({
            image: updateUserDto.image ?? '',
            name: updateUserDto.name ?? '',
            nickname: updateUserDto.nickname,
            intro: updateUserDto.intro ?? '',
        });
  
    }*/
        console.log(user);
        await this.userRepository.update(id, updateUserDto);

        return this.show(id);
    }
}
