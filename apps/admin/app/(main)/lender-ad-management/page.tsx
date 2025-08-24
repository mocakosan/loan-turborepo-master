import LenderAdManagement from "./lender-ad-management";
import { getRecommendedLenders } from "@/actions/admin/recommended-lender/get-recommended-lender";
import { getTopMainAdvertising } from "@/actions/admin/top-main-advertising/get-top-main-advertising";
import { getSponsorAds } from "@/actions/admin/sponsor-ad/get-sponsor-ads";
import { getLineAds } from "@/actions/admin/lender-ad-management/get-line-ads";
import { getRegionKinds } from "@/actions/admin/get-region-kinds";
import { getLoanKinds } from "@/actions/admin/get-loan-kinds";

export default async function Page() {
  const [
    regionKinds,
    loanKinds,
    recommendedLenders,
    topMainAdvertising,
    sponsorAds,
    lineAds,
  ] = await Promise.all([
    getRegionKinds(),
    getLoanKinds(),
    getRecommendedLenders(),
    getTopMainAdvertising(),
    getSponsorAds(),
    getLineAds(),
  ]);

  return (
    <LenderAdManagement
      regionKinds={regionKinds.regionKinds}
      loanKinds={loanKinds.loanKinds}
      recommendedLenders={recommendedLenders.recommendedLenders}
      topMainAdvertising={topMainAdvertising.topMainAdvertisings}
      sponsorAds={sponsorAds.sponsorAds}
      lineAds={lineAds.lineAds}
    />
  );
}
