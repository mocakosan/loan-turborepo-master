import { Injectable } from '@nestjs/common';
import { Enterpriser } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnterprisersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(identity: string): Promise<Enterpriser | null> {
    return this.prisma.enterpriser.findUnique({
      where: {
        identity,
      },
    });
  }
}
