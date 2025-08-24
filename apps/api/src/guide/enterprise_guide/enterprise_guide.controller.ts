import { Controller, Get, Render } from '@nestjs/common';

@Controller('guide/enterprise_guide')
export class EnterpriseGuideController {
  @Get()
  @Render('guide/enterprise_guide')
  async index() {}
}
