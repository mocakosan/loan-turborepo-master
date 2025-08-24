-- CreateEnum
CREATE TYPE "EnterpriserStatus" AS ENUM ('WAIT', 'APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "InquiryKind" AS ENUM ('PARTNERSHIP', 'ADVERTISING', 'NOTICE', 'OTHER', 'SUGGESTION', 'REPORT', 'ERROR', 'DELETE_LOAN_INQUIRY');

-- CreateEnum
CREATE TYPE "AdvertisingInquiryStatus" AS ENUM ('NEW_INQUIRY', 'WAIT_DEPOSIT', 'COMPLETE_DEPOSIT', 'COMPLETE_UPLOAD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "enterprisers" (
    "id" TEXT NOT NULL,
    "no" SERIAL NOT NULL,
    "identity" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "registration_start_date" TEXT NOT NULL,
    "registration_end_date" TEXT NOT NULL,
    "advertising_phone_number" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address_detail" TEXT NOT NULL,
    "registration_authority" TEXT NOT NULL,
    "registration_authority_phone_number" TEXT NOT NULL,
    "loan_license" TEXT NOT NULL,
    "business_license" TEXT NOT NULL,
    "is_receive_sms" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "connection_date" TIMESTAMP(3),
    "enterpriser_status" "EnterpriserStatus" NOT NULL DEFAULT 'WAIT',

    CONSTRAINT "enterprisers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "phone_number" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("phone_number")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "connection_date" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommended_lenders" (
    "id" SERIAL NOT NULL,
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "lender_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lender_id" INTEGER,

    CONSTRAINT "recommended_lenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_main_advertisings" (
    "id" SERIAL NOT NULL,
    "lender_name" TEXT NOT NULL,
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "top_main_advertisings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region_kinds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "region_kinds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_kinds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_kinds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lenders" (
    "id" SERIAL NOT NULL,
    "background_image" TEXT NOT NULL DEFAULT '',
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "lender_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "is_visible_main" BOOLEAN NOT NULL DEFAULT false,
    "is_visible_area" BOOLEAN NOT NULL DEFAULT false,
    "is_visible_loan" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lender_infos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "registration_authority" TEXT NOT NULL,
    "registration_authority_phone_number" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "month_rate" TEXT NOT NULL,
    "loan_limit" TEXT NOT NULL,
    "additional_cost" TEXT NOT NULL,
    "repayment_method" TEXT NOT NULL,
    "year_rate" TEXT NOT NULL,
    "overdue_rate" TEXT NOT NULL,
    "early_repayment_fee" TEXT NOT NULL,
    "repayment_period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lender_id" INTEGER,

    CONSTRAINT "lender_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recent_lender_views" (
    "id" SERIAL NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enterpriser_id" TEXT NOT NULL,
    "lender_id" INTEGER NOT NULL,

    CONSTRAINT "recent_lender_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_inquiries" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_job" BOOLEAN NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "is_after_consult" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_agree_marketing" BOOLEAN NOT NULL DEFAULT false,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "region_kind_id" INTEGER NOT NULL,
    "loan_kind_id" INTEGER,

    CONSTRAINT "loan_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_inquiry_registrations" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enterpriser_id" TEXT NOT NULL,

    CONSTRAINT "loan_inquiry_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_news" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_news" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inquiry_kind" "InquiryKind" NOT NULL,
    "phone_number" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reply" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qnas" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reply" TEXT,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qnas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertising_guide" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "standard" TEXT NOT NULL DEFAULT '',
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertising_guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertising_inquiries" (
    "id" SERIAL NOT NULL,
    "advertisingInquiryKind" TEXT NOT NULL,
    "status" "AdvertisingInquiryStatus" NOT NULL DEFAULT 'NEW_INQUIRY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "enterpriserId" TEXT NOT NULL,
    "advertisingGuideId" INTEGER,

    CONSTRAINT "advertising_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_ads" (
    "id" SERIAL NOT NULL,
    "lender_name" TEXT NOT NULL,
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsor_ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_ads" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "title1" TEXT NOT NULL,
    "title2" TEXT NOT NULL,
    "lender_name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "total_visits" (
    "id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "is_auto" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "total_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_logs" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ip_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_inquiry_counts" (
    "id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "loan_inquiry_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnterpriserToLoanInquiry" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EnterpriserToLoanInquiry_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LenderToRegionKind" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LenderToRegionKind_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LenderToLoanKind" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LenderToLoanKind_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LoanInquiryToLoanInquiryRegistration" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LoanInquiryToLoanInquiryRegistration_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "enterprisers_no_key" ON "enterprisers"("no");

-- CreateIndex
CREATE UNIQUE INDEX "enterprisers_identity_key" ON "enterprisers"("identity");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_phone_number_key" ON "verifications"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "recommended_lenders_lender_id_key" ON "recommended_lenders"("lender_id");

-- CreateIndex
CREATE UNIQUE INDEX "lender_infos_lender_id_key" ON "lender_infos"("lender_id");

-- CreateIndex
CREATE INDEX "recent_lender_views_enterpriser_id_viewed_at_idx" ON "recent_lender_views"("enterpriser_id", "viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "recent_lender_views_enterpriser_id_lender_id_key" ON "recent_lender_views"("enterpriser_id", "lender_id");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_date_key" ON "visitors"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ip_logs_ip_date_key" ON "ip_logs"("ip", "date");

-- CreateIndex
CREATE INDEX "_EnterpriserToLoanInquiry_B_index" ON "_EnterpriserToLoanInquiry"("B");

-- CreateIndex
CREATE INDEX "_LenderToRegionKind_B_index" ON "_LenderToRegionKind"("B");

-- CreateIndex
CREATE INDEX "_LenderToLoanKind_B_index" ON "_LenderToLoanKind"("B");

-- CreateIndex
CREATE INDEX "_LoanInquiryToLoanInquiryRegistration_B_index" ON "_LoanInquiryToLoanInquiryRegistration"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_lenders" ADD CONSTRAINT "recommended_lenders_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "lenders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lender_infos" ADD CONSTRAINT "lender_infos_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "lenders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_lender_views" ADD CONSTRAINT "recent_lender_views_enterpriser_id_fkey" FOREIGN KEY ("enterpriser_id") REFERENCES "enterprisers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_lender_views" ADD CONSTRAINT "recent_lender_views_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "lenders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_inquiries" ADD CONSTRAINT "loan_inquiries_region_kind_id_fkey" FOREIGN KEY ("region_kind_id") REFERENCES "region_kinds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_inquiries" ADD CONSTRAINT "loan_inquiries_loan_kind_id_fkey" FOREIGN KEY ("loan_kind_id") REFERENCES "loan_kinds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_inquiry_registrations" ADD CONSTRAINT "loan_inquiry_registrations_enterpriser_id_fkey" FOREIGN KEY ("enterpriser_id") REFERENCES "enterprisers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertising_inquiries" ADD CONSTRAINT "advertising_inquiries_enterpriserId_fkey" FOREIGN KEY ("enterpriserId") REFERENCES "enterprisers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertising_inquiries" ADD CONSTRAINT "advertising_inquiries_advertisingGuideId_fkey" FOREIGN KEY ("advertisingGuideId") REFERENCES "advertising_guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnterpriserToLoanInquiry" ADD CONSTRAINT "_EnterpriserToLoanInquiry_A_fkey" FOREIGN KEY ("A") REFERENCES "enterprisers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnterpriserToLoanInquiry" ADD CONSTRAINT "_EnterpriserToLoanInquiry_B_fkey" FOREIGN KEY ("B") REFERENCES "loan_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LenderToRegionKind" ADD CONSTRAINT "_LenderToRegionKind_A_fkey" FOREIGN KEY ("A") REFERENCES "lenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LenderToRegionKind" ADD CONSTRAINT "_LenderToRegionKind_B_fkey" FOREIGN KEY ("B") REFERENCES "region_kinds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LenderToLoanKind" ADD CONSTRAINT "_LenderToLoanKind_A_fkey" FOREIGN KEY ("A") REFERENCES "lenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LenderToLoanKind" ADD CONSTRAINT "_LenderToLoanKind_B_fkey" FOREIGN KEY ("B") REFERENCES "loan_kinds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LoanInquiryToLoanInquiryRegistration" ADD CONSTRAINT "_LoanInquiryToLoanInquiryRegistration_A_fkey" FOREIGN KEY ("A") REFERENCES "loan_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LoanInquiryToLoanInquiryRegistration" ADD CONSTRAINT "_LoanInquiryToLoanInquiryRegistration_B_fkey" FOREIGN KEY ("B") REFERENCES "loan_inquiry_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
