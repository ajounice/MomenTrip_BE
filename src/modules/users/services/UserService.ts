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
        if (request.changePassword !== request.changePasswordConfirmation) {
            throw new BadRequestException('신규 비밀번호 검증 실패');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!bcrypt.compareSync(request.currentPassword, user.password)) {
            throw new BadRequestException('현재 비밀번호 불일치');
        }

        if (!user) {
            throw new BadRequestException('유저 정보 오류');
        }

        user.password = bcrypt.hashSync(request.changePassword, 10);

        return this.userRepository.save(user);
    }
}
