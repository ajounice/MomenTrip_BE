import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import * as config from 'config';

const kakaoConfig = config.get('kakao');

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: kakaoConfig.clientID,
      callbackURL: kakaoConfig.callbackURL,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    /*8 const profileJson = profile._json;
     const kakao_account = profileJson.kakao_account;
     const payload: {
       name: kakao_account.profile.nickname,
       kakaoId: profileJson.id,
       email:
         kakao_account.has_email && !kakao_account.email_needs_agreement
           ? kakao_account.email
           : null,
       accessToken,
     };*/
     done(null, payload);
}