import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SponsorAdMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const sponsorAds = await this.prisma.sponsorAd.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          lenderName: true,
          title1: true,
          title2: true,
          link: true,
        },
      });

      res.locals.sponsorAds = sponsorAds || [];
    } catch (error) {
      console.error('sponsorAds error:', error);
      res.locals.sponsorAds = [];
    }

    next();
  }
}
