import { Controller, Get, Query, Render } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('enterprise/area_enterprise')
export class AreaEnterpriseController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('enterprise/area_enterprise')
  async index(
    @Query('search') search: string = '', // 검색어
    @Query('sido') sido: string = '', // 지역
  ) {
    const whereConditions = [`a.is_visible_area = true`];

    if (search) {
      whereConditions.push(`(
          a.title1 ILIKE '%${search}%' OR
          a.title2 ILIKE '%${search}%' OR
          a.content ILIKE '%${search}%' OR
          a.lender_name ILIKE '%${search}%' OR
          a.phone_number ILIKE '%${search}%'
        )`);
    }

    const sidoId = Number(sido);
    if (!isNaN(sidoId) && sidoId > 0) {
      whereConditions.push(`c.id = ${sidoId}`);
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(' AND ')}`
      : ``;

    const [regionKinds, lenders] = await Promise.all([
      this.prisma.regionKind.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.$queryRaw`
        SELECT * FROM (
          SELECT DISTINCT ON (a.id)
            a.id, 
            a.title1, 
            a.title2, 
            a.lender_name as "lenderName", 
            a.content, 
            a.phone_number as "phoneNumber",
            a.background_image as "backgroundImage"
          FROM lenders AS a
          JOIN "_LenderToRegionKind" AS b ON b."A" = a.id
          JOIN region_kinds AS c ON c.id = b."B"
          ${Prisma.raw(whereClause)}
          ORDER BY a.id, RANDOM()
        ) AS sub
        ORDER BY RANDOM();
      `,
    ]);

    return {
      sidoList: regionKinds,
      lenders,
      search,
      sido,
    };
  }
}
