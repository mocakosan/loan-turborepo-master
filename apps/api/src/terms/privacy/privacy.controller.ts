import { Controller, Get, Render } from '@nestjs/common';

@Controller('terms/privacy')
export class PrivacyController {
  @Get()
  @Render('terms/privacy')
  async index() {
    return {};
  }
}
