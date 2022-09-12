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

    public filterByNickname(text: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .select()
            .where(`user.nickname like :text`, { text: `%${text}%` })
            .getMany();
    }
}
