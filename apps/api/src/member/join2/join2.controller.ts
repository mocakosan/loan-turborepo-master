import { Controller, Get, Render } from '@nestjs/common';

@Controller('member/join2')
export class Join2Controller {
  @Get()
  @Render('member/join2')
  async index() {}
}
