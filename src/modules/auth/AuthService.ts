import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { UserService } from '@/modules/users/UserService';
import { UserKakaoDto } from '@/modules/users/dtos';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    async validateUser(userId: string, password: string): Promise<any> {
        const user = await this.userService.findById(userId);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { userId: user.userId, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async kakaoLogin(userKakao: UserKakaoDto): Promise<{ accessToken: string }> {
        const { kakaoId, nickname, email } = userKakao;
        let user = await this.userService.findByKakaoId(userKakao.kakaoId);
        if (!user) {
            user = this.userRepository.create({
                kakaoId,
                nickname,
                email,
            });

            try {
                await this.userRepository.save(user);
            } catch (e) {
                if (e.code === '23505') {
                    throw new ConflictException('Existing User');
                } else {
                    throw new InternalServerErrorException();
                }
            }
        }
        const payload = { id: user.id, accessToken: userKakao.accessToken };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
