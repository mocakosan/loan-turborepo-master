import { Controller, Get, Render } from '@nestjs/common';

@Controller('guide/notandum')
export class NotandumController {
  @Get()
  @Render('guide/notandum')
  async index() {}
}
