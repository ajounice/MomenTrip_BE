import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { UserKakaoDto } from '@/modules/auth/dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async kakaoLogin(userKakaoDto: UserKakaoDto): Promise<{ accessToken: string }> {
        const { nickname, name, email, image } = userKakaoDto;
        let user = await this.userRepository.findOne({
            where: { nickname: userKakaoDto.nickname },
        });
        if (!user) {
            user = this.userRepository.create({
                nickname,
                name,
                email,
                image,
            });
            await this.userRepository.save(user);
        }
        const payload = { id: user.id };
        //유저 정보를 통해 토큰 값을 생성
        const accessToken = this.jwtService.sign(payload);
        console.log(accessToken);
        return { accessToken };
    }
}
