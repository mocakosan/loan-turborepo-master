import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('service/notice_view')
export class NoticeViewController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async index(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const idNumber = Number(id);
    if (isNaN(idNumber) || idNumber <= 0) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    const notice = await this.prisma.notice.findUnique({
      where: {
        id: idNumber,
      },
    });

    if (!notice) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    // 조회수 증가
    await this.prisma.notice.update({
      where: {
        id: idNumber,
      },
      data: {
        hits: {
          increment: 1,
        },
      },
    });

    return res.render('service/notice_view', {
      notice: {
        ...notice,
        createdAt: format(notice.createdAt, 'yyyy.MM.dd HH:mm'),
      },
    });
  }
}
