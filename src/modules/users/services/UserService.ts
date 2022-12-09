import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UpdatePasswordRequest } from '@/modules/users/dto/request';
import { BadRequestException } from '@/common/exceptions';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    //닉네임 중복 검사
    async checkNickname(nickname: string): Promise<boolean> {
        const count = await this.userRepository.count({ where: { nickname: nickname } });

        return !!count;
    }

    //탈퇴
    async deleteUser(id: number) {
        await this.userRepository.delete({ id: id });
    }

    public findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    public filterByNickname(text: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .select()
            .where(`user.nickname like :text`, { text: `%${text}%` })
            .getMany();
    }

    public findByNickname(nickname: string): Promise<User> {
        return this.userRepository.findOne({ where: { nickname } });
    }

    public async updatePassword(userId: number, request: UpdatePasswordRequest) {
        if (request.password !== request.passwordConfirmation) {
            throw new BadRequestException();
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException();
        }

        user.password = bcrypt.hashSync(request.password, 10);

        return this.userRepository.save(user);
    }
}
