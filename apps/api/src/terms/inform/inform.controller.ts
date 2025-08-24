import { Controller, Get, Render } from '@nestjs/common';

@Controller('terms/inform')
export class InformController {
  @Get()
  @Render('terms/inform')
  async index() {
    return {};
  }
}
