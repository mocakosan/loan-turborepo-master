import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { jwtConstants } from './constants';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentEnterpriser() enterpriser: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(enterpriser);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, // TODO: HTTPS에서만 사용 (개발 시 false)
      maxAge: jwtConstants.expiresIn,
    });

    return { message: '로그인을 성공했습니다.' };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // 쿠키 삭제
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // HTTPS에서만 사용 (개발 시 false)
    });

    // 로그아웃 후 리디렉트
    return res.redirect('/');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
