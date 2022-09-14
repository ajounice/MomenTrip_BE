import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { UserKakaoDto, UserLocalDto } from '@/modules/auth/dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { BadRequestException } from '@/common/exceptions';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async kakaoLogin(userKakaoDto: UserKakaoDto): Promise<{ accessToken: string }> {
        const { name, email, image } = userKakaoDto;
        let user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            user = this.userRepository.create({
                //id,
                name,
                email,
                image,
            });
            await this.userRepository.save(user);
        }
        const payload = { id: user.id };
        //유저 정보를 통해 토큰 값을 생성
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    async validateUser(userLocalDto: UserLocalDto): Promise<User> {
        const { email, password } = userLocalDto;
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user || (user && !compare(password, user.password))) {
            throw new BadRequestException();
        }
        return user;
    }

    async localLogin(userLocalDto: UserLocalDto): Promise<{ accessToken: string }> {
        const { email, password } = userLocalDto;
        let user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            user = this.userRepository.create({
                email,
                password,
            });
            await this.userRepository.save(user);
        }
        const payload = { id: user.id };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
