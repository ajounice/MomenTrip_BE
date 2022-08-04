import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import * as config from 'config';
import { UserKakaoDto } from '@/modules/users/auth/dtos';

//const kakaoConfig = config.get('kakao');

export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            clientID: process.env.KAKAO_KEY,
            callbackURL: process.env.KAKAPO_CALLBACK_URL,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);

        const profileJson = profile._json;
        const kakao_account = profileJson.kakao_account;
        const payload: UserKakaoDto = {
            nickname: kakao_account.profile.nickname,
            kakaoId: profileJson.kakaoId,
            email:
                kakao_account.has_email && !kakao_account.email_needs_agreement
                    ? kakao_account.email
                    : null,
            image:
                kakao_account.profile_image_needs_agreement &&
                !kakao_account.profile.is_default_image
                    ? kakao_account.profile.profile_image_url
                    : null,
            accessToken,
        };
        done(null, payload);
    }
}
