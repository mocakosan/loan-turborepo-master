import { Controller, Get, Render } from '@nestjs/common';

@Controller('member/join')
export class JoinController {
  @Get()
  @Render('member/join')
  async index() {}
}
