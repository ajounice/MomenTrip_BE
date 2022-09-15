import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { CreateUserDto, UserKakaoDto, UserLocalDto } from '@/modules/auth/dto';
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
        //console.log('validateUser service', email, password);
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        //console.log(user);
        if (!user) {
            return null;
        }
        return user;
    }

    async localLogin(userLocalDto: UserLocalDto): Promise<{ accessToken: string }> {
        const { email, password } = userLocalDto;
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        //console.log('locallogin service ', user);
        if (!user || (user && !compare(password, user.password))) {
            throw new BadRequestException();
        }
        //console.log('local login service', user);
        const payload = { id: user.id };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;
        const user = await this.userRepository.count({
            where: { email: email },
        });
        if (!user) {
            const user = this.userRepository.create({
                email,
                password,
            });
            return await this.userRepository.save(user);
        }
    }
}
