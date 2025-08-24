import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AreaEnterpriseController } from './enterprise/area_enterprise/area_enterprise.controller';
import { EnterpriseDetailsController } from './enterprise/enterprise_details/enterprise_details.controller';
import { ItemsEnterpriseController } from './enterprise/items_enterprise/items_enterprise.controller';
import { RealInquiryController } from './realtime/real_inquiry/real_inquiry.controller';
import { RealWriteController } from './realtime/real_write/real_write.controller';
import { RealBoardController } from './realtime/real_board/real_board.controller';
import { JoinController } from './member/join/join.controller';
import { Join2Controller } from './member/join2/join2.controller';
import { AuthModule } from './auth/auth.module';
import { EnterprisersModule } from './enterprisers/enterprisers.module';
import { CommunityIntroController } from './community/community_intro/community_intro.controller';
import { FinancialNewsController } from './community/financial_news/financial_news.controller';
import { LoanNewsController } from './community/loan_news/loan_news.controller';
import { QnaListController } from './community/qna_list/qna_list.controller';
import { BoardViewController } from './community/board_view/board_view.controller';
import { CustomerGuideController } from './guide/customer_guide/customer_guide.controller';
import { EnterpriseGuideController } from './guide/enterprise_guide/enterprise_guide.controller';
import { NotandumController } from './guide/notandum/notandum.controller';
import { NoticeListController } from './service/notice_list/notice_list.controller';
import { OneInquiryController } from './service/one_inquiry/one_inquiry.controller';
import { AdvertisingInquiryController } from './service/advertising_inquiry/advertising_inquiry.controller';
import { IntroduceController } from './introduction/introduce/introduce.controller';
import { LoginController } from './member/login/login.controller';
import { EnterpriserMiddleware } from './common/middleware/enterpriser.middleware';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { AligoModule } from './aligo/aligo.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseService } from './supabase/supabase.service';
import { ClauseController } from './terms/clause/clause.controller';
import { PrivacyController } from './terms/privacy/privacy.controller';
import { InformController } from './terms/inform/inform.controller';
import { LoanInquiryController } from './loan-inquiry/loan-inquiry.controller';
import { MypageController } from './member/mypage/mypage.controller';
import { Mypage3Controller } from './member/mypage3/mypage3.controller';
import { VisitorMiddleware } from './common/middleware/visitor.middleware';
import { NoticeViewController } from './service/notice_view/notice_view.controller';
import { SponsorAdMiddleware } from './common/middleware/sponsor-ad.middleware';
import { LatelyVisitController } from './enterprise/lately_visit/lately_visit.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { VisitorController } from './visitor/visitor.controller';
import { SendmModule } from './sendm/sendm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    EnterprisersModule,
    MailerModule,
    AligoModule,
    SendmModule,
  ],
  controllers: [
    AppController,
    AreaEnterpriseController,
    EnterpriseDetailsController,
    ItemsEnterpriseController,
    RealInquiryController,
    RealWriteController,
    RealBoardController,
    JoinController,
    Join2Controller,
    CommunityIntroController,
    FinancialNewsController,
    LoanNewsController,
    QnaListController,
    BoardViewController,
    CustomerGuideController,
    EnterpriseGuideController,
    NotandumController,
    NoticeListController,
    OneInquiryController,
    AdvertisingInquiryController,
    IntroduceController,
    LoginController,
    ClauseController,
    PrivacyController,
    InformController,
    LoanInquiryController,
    MypageController,
    Mypage3Controller,
    NoticeViewController,
    LatelyVisitController,
    VisitorController,
  ],
  providers: [SupabaseService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnterpriserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // 모든 요청에 적용

    consumer
      .apply(VisitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // 모든 요청에 적용

    consumer
      .apply(SponsorAdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // 모든 요청에 적용
  }
}
