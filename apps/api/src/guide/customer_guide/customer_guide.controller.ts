import { Controller, Get, Render } from '@nestjs/common';

@Controller('guide/customer_guide')
export class CustomerGuideController {
  @Get()
  @Render('guide/customer_guide')
  async index() {}
}
