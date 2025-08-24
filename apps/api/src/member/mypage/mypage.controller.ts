import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('member/mypage')
export class MypageController {
  @UseGuards(JwtAuthGuard)
  @Get()
  @Render('member/mypage')
  index() {}
}
