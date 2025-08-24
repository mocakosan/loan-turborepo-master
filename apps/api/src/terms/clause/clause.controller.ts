import { Controller, Get, Render } from '@nestjs/common';

@Controller('terms/clause')
export class ClauseController {
  @Get()
  @Render('terms/clause')
  async index() {
    return {};
  }
}
