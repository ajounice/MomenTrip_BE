import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto';
import { NotFoundException } from '@/common/exceptions';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    async remove(id: number) {
        await this.userRepository.delete({ id: id });
    }
}
