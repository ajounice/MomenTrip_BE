import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import * as config from 'config';

const kakaoConfig = config.get('kakao');

export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            clientID: process.env.KAKAO_KEY,
            callbackURL: process.env.KAKAPO_CALLBACK_URL,
        });
    }

    async validate(accessToken, refreshToken, profile, done) {
        /* const profileJson = profile._json;
        const kakao_account = profileJson.kakao_account;
        const payload: {
            name: kakao_account.profile.nickname,
            kakaoId: profileJson.kakaoId,
            email:
                kakao_account.has_email && !kakao_account.email_needs_agreement
                ? account.email
                : null,
            accessToken,
        };
        done(null, payload);*/
    }
}
