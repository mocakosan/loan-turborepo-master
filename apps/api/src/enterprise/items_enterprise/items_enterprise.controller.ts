import { Controller, Get, Query, Render } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('enterprise/items_enterprise')
export class ItemsEnterpriseController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('enterprise/items_enterprise')
  async index(
    @Query('search') search: string = '', // 검색어
    @Query('category') category: string = '', // 상품종류
  ) {
    const whereConditions = [`a.is_visible_loan = true`];

    if (search) {
      whereConditions.push(`(
        a.title1 ILIKE '%${search}%' OR
        a.title2 ILIKE '%${search}%' OR
        a.content ILIKE '%${search}%' OR
        a.lender_name ILIKE '%${search}%' OR
        a.phone_number ILIKE '%${search}%'
      )`);
    }

    const categoryId = Number(category);
    if (!isNaN(categoryId) && categoryId > 0) {
      whereConditions.push(`c.id = ${categoryId}`);
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(' AND ')}`
      : ``;

    const [loanKinds, lenders] = await Promise.all([
      this.prisma.loanKind.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.$queryRaw`
        SELECT 
          a.id, 
          a.title1, 
          a.title2, 
          a.lender_name as "lenderName",
          a.content, 
          a.phone_number as "phoneNumber",
          a.background_image as "backgroundImage"
        FROM lenders AS a
        JOIN "_LenderToLoanKind" AS b ON b."A" = a.id
        JOIN loan_kinds AS c ON c.id = b."B"
        ${Prisma.raw(whereClause)}
        ORDER BY RANDOM();
      `,
    ]);

    return {
      loanList: loanKinds,
      lenders,
      search,
      category,
    };
  }
}
