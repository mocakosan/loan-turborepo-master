import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identity',
      passwordField: 'password',
    });
  }

  async validate(identity: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identity, password);
    if (!user) {
      throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요.');
    }

    if (user.enterpriserStatus === 'WAIT') {
      throw new BadRequestException('가입 승인 대기중입니다.');
    }

    if (user.enterpriserStatus === 'REJECT') {
      throw new BadRequestException('가입이 거절되었습니다.');
    }

    return user;
  }
}
