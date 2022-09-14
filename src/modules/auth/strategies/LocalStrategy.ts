import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserLocalDto } from '@/modules/auth/dto';
import { AuthService } from '@/modules/auth/AuthService';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email', //form field
            passwordField: 'password',
            passReqToCallback: false,
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const payload: UserLocalDto = { email, password };
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
