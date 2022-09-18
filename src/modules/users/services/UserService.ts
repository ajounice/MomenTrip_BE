import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    //닉네임 중복 검사
    public async checkNickname(nickname: string): Promise<boolean> {
        const count = await this.userRepository.count({ where: { nickname: nickname } });
        console.log(count);

        if (count) {
            return true; //중복 존재
        }
        return false;
    }

    //탈퇴
    async deleteUser(id: number) {
        await this.userRepository.delete({ id: id });
    }

    public findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    public findByNickname(nickname: string): Promise<User> {
        return this.userRepository.findOne({ where: { nickname } });
    }
}
