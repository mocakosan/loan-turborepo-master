import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('community/board_view')
export class BoardViewController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async index(
    @Param('id') id: string = '', // ID
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const idNumber = Number(id);
    if (isNaN(idNumber) || idNumber <= 0) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    const qna = await this.prisma.qnA.findUnique({
      where: {
        id: idNumber,
      },
      select: {
        title: true,
        content: true,
        reply: true,
        createdAt: true,
        hits: true,
      },
    });

    if (!qna) {
      const referer = req.get('Referrer') || '/';
      return res.redirect(referer);
    }

    return res.render('community/board_view', {
      qna: {
        ...qna,
        createdAt: format(qna.createdAt, 'yyyy.MM.dd HH:mm'),
      },
    });
  }
}
