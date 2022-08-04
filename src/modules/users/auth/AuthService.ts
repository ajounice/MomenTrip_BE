import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { UserKakaoDto } from '@/modules/users/auth/dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async kakaoLogin(userKakao: UserKakaoDto): Promise<{ accessToken: string }> {
        const { kakaoId, nickname, email, image } = userKakao;
        let user = await this.userRepository.findOne({ where: { kakaoId: userKakao.kakaoId } });
        if (!user) {
            user = this.userRepository.create({
                kakaoId,
                nickname,
                email,
                image,
            });
            await this.userRepository.save(user);
        }
        const payload = { id: user.id, accessToken: userKakao.accessToken };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
