import { Controller, Get, Render } from '@nestjs/common';

@Controller('member/login')
export class LoginController {
  @Get()
  @Render('member/login')
  index() {}
}
