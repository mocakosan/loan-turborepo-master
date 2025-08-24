import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentEnterpriser } from 'src/common/decorators/current-enterpriser.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('enterprise/enterprise_details')
export class EnterpriseDetailsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async index(
    @CurrentEnterpriser() enterpriser: any,
    @Param('id') id: string = '', // ID
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const idNumber = Number(id);
    if (isNaN(idNumber) || idNumber <= 0) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    const lender = await this.prisma.lender.findUnique({
      where: {
        id: idNumber,
      },
      select: {
        lenderInfo: {
          select: {
            title: true,
            companyName: true,
            registrationNumber: true,
            phoneNumber: true,
            registrationAuthority: true,
            registrationAuthorityPhoneNumber: true,
            office: true,
            monthRate: true,
            loanLimit: true,
            additionalCost: true,
            repaymentMethod: true,
            yearRate: true,
            overdueRate: true,
            earlyRepaymentFee: true,
            repaymentPeriod: true,
            description: true,
          },
        },
        regionKinds: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!lender) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    if (enterpriser) {
      await this.prisma.recentLenderView.upsert({
        where: {
          enterpriserId_lenderId: {
            enterpriserId: enterpriser.id,
            lenderId: idNumber,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          enterpriserId: enterpriser.id,
          lenderId: idNumber,
          viewedAt: new Date(),
        },
      });
    }

    return res.render('enterprise/enterprise_details', {
      lender: {
        ...lender,
        regionKind: lender?.regionKinds.map((item) => item.name).join(', '),
      },
    });
  }
}
