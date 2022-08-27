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
}
