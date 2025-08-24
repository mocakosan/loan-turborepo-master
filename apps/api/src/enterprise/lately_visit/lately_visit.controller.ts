import { Controller, Get, Render } from '@nestjs/common';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('enterprise/lately_visit')
export class LatelyVisitController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('enterprise/lately_visit')
  async index(@CurrentEnterpriser() enterpriser: any) {
    if (!enterpriser) {
      return {
        lenders: [],
      };
    }

    const recentLenderViews = await this.prisma.recentLenderView.findMany({
      where: {
        enterpriserId: enterpriser.id,
      },
      orderBy: {
        viewedAt: 'desc',
      },
      select: {
        lender: {
          select: {
            id: true,
            title1: true,
            title2: true,
            lenderName: true,
            content: true,
            phoneNumber: true,
            backgroundImage: true,
          },
        },
      },
    });

    const lenders = recentLenderViews.map((item) => ({
      ...item.lender,
    }));

    return {
      lenders,
    };
  }
}
