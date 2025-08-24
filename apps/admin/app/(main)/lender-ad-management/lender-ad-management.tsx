"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LenderTab from "./_components/lender-tab";
import { GetRecommendedLenders } from "@/actions/admin/recommended-lender/get-recommended-lender";
import RecommendedLenderTab from "./_components/recommended-lender-tab";
import { GetTopMainAdvertising } from "@/actions/admin/top-main-advertising/get-top-main-advertising";
import TopMainAdvertisingTab from "./_components/top-main-advertising-tab";
import { GetSponsorAds } from "@/actions/admin/sponsor-ad/get-sponsor-ads";
import SponsorAdTab from "./_components/sponsor-ad-tab";
import { GetLineAds } from "@/actions/admin/lender-ad-management/get-line-ads";
import LineAdTab from "./_components/line-ad-tab";
import { GetRegionKinds } from "@/actions/admin/get-region-kinds";
import { GetLoanKinds } from "@/actions/admin/get-loan-kinds";

type Props = {
  regionKinds: GetRegionKinds["regionKinds"];
  loanKinds: GetLoanKinds["loanKinds"];
  recommendedLenders: GetRecommendedLenders["recommendedLenders"];
  topMainAdvertising: GetTopMainAdvertising["topMainAdvertisings"];
  sponsorAds: GetSponsorAds["sponsorAds"];
  lineAds: GetLineAds["lineAds"];
};

export default function LenderAdManagement({
  regionKinds,
  loanKinds,
  recommendedLenders,
  topMainAdvertising,
  sponsorAds,
  lineAds,
}: Props) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">업체 및 광고 관리</h1>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="companies">
            대출업체 관리 및 메인광고 설정
          </TabsTrigger>
          <TabsTrigger value="recommended">추천 대출 대부업체</TabsTrigger>
          <TabsTrigger value="ads">상위 메인 광고</TabsTrigger>
          <TabsTrigger value="sponsor-ad">스폰서 광고</TabsTrigger>
          <TabsTrigger value="line-ad">줄 광고</TabsTrigger>
        </TabsList>

        {/* 대출업체 관리 및 메인광고 설정 탭 */}
        <LenderTab regionKinds={regionKinds} loanKinds={loanKinds} />

        {/* 추천 대출 대부업체 탭 */}
        <RecommendedLenderTab recommendedLenders={recommendedLenders} />

        {/* 상위 메인 광고 탭 */}
        <TopMainAdvertisingTab topMainAdvertising={topMainAdvertising} />

        {/* 스폰서 광고 탭 */}
        <SponsorAdTab sponsorAds={sponsorAds} />

        {/* 줄 광고 탭 */}
        <LineAdTab lineAds={lineAds} />
      </Tabs>
    </div>
  );
}
