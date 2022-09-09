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
    /*
    public findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }*/
    //닉네임 중복 검사
    findNickname(nickname: string) {
        const user = this.userRepository.findOne({ where: { nickname } });
        return user;
    }

    //탈퇴
    async deleteUser(id: number) {
        await this.userRepository.delete({ id: id });
    }
}
