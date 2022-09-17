import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { Repository } from 'typeorm';
import { CreateUserDto, UserKakaoDto, UserLocalDto } from '@/modules/auth/dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { BadRequestException } from '@/common/exceptions';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    private async verifyPassword(plainPassword: string, hashedPassword: string) {
        const isMatch = await compare(plainPassword, hashedPassword);
        if (!isMatch) {
            throw new BadRequestException();
        }
    }

    async kakaoLogin(userKakaoDto: UserKakaoDto): Promise<{ accessToken: string }> {
        const { name, email, image } = userKakaoDto;
        let user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            user = await this.userRepository.create({
                name,
                email,
                image,
            });
            user = await this.userRepository.save(user);
        }
        const payload = { id: user.id, email: user.email };
        //유저 정보를 통해 토큰 값을 생성
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    async validateUser(userLocalDto: UserLocalDto): Promise<User> {
        const { email, password } = userLocalDto;
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            return null;
        }
        await this.verifyPassword(password, user.password);
        //user.password = undefined;

        return user;
    }

    async localLogin(userLocalDto: UserLocalDto): Promise<{ accessToken: string }> {
        const { email } = userLocalDto;
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            throw new BadRequestException();
        }
        // await this.verifyPassword(password, user.password);
        const payload = { id: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;
        const user = await this.userRepository.count({
            where: { email: email },
        });

        const hashPassword = await hash(password, 10);

        if (!user) {
            const user = await this.userRepository.create({
                email,
                password: hashPassword,
            });
            return await this.userRepository.save(user);
        }
    }
}
