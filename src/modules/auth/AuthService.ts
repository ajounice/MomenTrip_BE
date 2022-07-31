import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { UserKakaoDto } from '@/modules/auth/dtos';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async kakaoLogin(userKakao: UserKakaoDto): Promise<{ accessToken: string }> {
        const { kakaoId, nickname, email } = userKakao;
        let user = await this.userRepository.findOne({ where: { kakaoId: userKakao.kakaoId } });
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
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
    }
    /*
    async validateUser(userId: number, password: string): Promise<any> {
        const user = await this.userRepository.////;
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
 */
}
