import { Controller, Get, Render } from '@nestjs/common';

@Controller('introduction/introduce')
export class IntroduceController {
  @Get()
  @Render('introduction/introduce')
  index() {}
}
