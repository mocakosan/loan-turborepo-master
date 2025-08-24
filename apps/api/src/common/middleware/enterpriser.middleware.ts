import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnterpriserMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.access_token;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, jwtConstants.secret);
        if (decoded) {
          const enterpriser = await this.prisma.enterpriser.findUnique({
            where: {
              identity: decoded.sub,
            },
            select: {
              id: true,
              identity: true,
              name: true,
              phoneNumber: true,
            },
          });

          req.user = {
            ...enterpriser,
          };
        }
      } catch (error) {
        console.error('JWT error:', error);
        req.user = undefined;
      }
    }

    res.locals.user = req.user || null;
    res.locals.meta = {
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    };

    next();
  }
}
