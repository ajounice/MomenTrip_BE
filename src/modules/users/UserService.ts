import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    /*
    //모든 유저 조회
    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }*/

    //단일 유저 조회
    async findById(userId: number): Promise<User> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async findByKakaoId(kakaoId: string): Promise<User> {
        return this.userRepository.findOne({ where: { kakaoId: kakaoId } });
    }

    //유저 생성
    async createUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
    //유저 삭제
    async deleteUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException();
        }
        if (Number(userId) !== user.id) {
            throw new ForbiddenException();
        }

        return this.userRepository.remove(user);
    }

    /*
    //로그인 유저 조회
    async findByLogin(userId: string, password: string): Promise<User> {
        return this.userRepository.findOne({ where: { id: userId, password } });
    }

   */
}
