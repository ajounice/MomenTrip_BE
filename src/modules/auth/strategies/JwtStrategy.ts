import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';

require('dotenv').config();

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload) {
        const { id } = payload;
        const user: User = await this.userRepository.findOne(id);
        if (!user) {
            throw new UnauthorizedException('InvalidToken');
        }
        return user;
    }
}
