import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserKakaoDto } from '@/modules/auth/dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<String>('KAKAO_KEY'),
            callbackURL: configService.get<String>('KAKAO_CALLBACK_URL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const { kakao_account } = profile._json;
        const payload: UserKakaoDto = {
            name:
                kakao_account.has_nickname && !kakao_account.profile_nickname_needs_agreement
                    ? kakao_account.profile.nickname
                    : null,
            email: kakao_account.email,
            image:
                !kakao_account.profile_image_needs_agreement &&
                !kakao_account.profile.is_default_image
                    ? kakao_account.profile.profile_image_url
                    : null,
            accessToken,
        };
        done(null, payload);
    }
}
