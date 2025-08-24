import { Prisma } from "../generated/prisma";

export const fakerAdvertisingGuide: Prisma.AdvertisingGuideCreateInput[] = [
  {
    title: "모두 광고( 메인 + 전지역 + 전상품 )",
    amount: 2000000,
    standard: "한달 기준",
    position: "PC/모바일",
    description: "메인페이지, 지역별 업체 상단, 상품별 업체 상단",
  },
  {
    title: "메인",
    amount: 1300000,
    standard: "한달 기준",
    position: "PC/모바일",
    description:
      "PC와 모바일 홈페이지 접속시 첫화면 중앙에 노출되는 상품으로서 방문자의 클릭률이 높은 위치",
  },
  {
    title: "실시간대출문의 업체등록 횟수",
    amount: 200000,
    standard: "한달 기준 200회",
    position: "PC/모바일",
    description:
      "일일 사용회수 제한 없음. 광고연장 시 남은 이용권은 이월되며, 미연장시 광고 종료와 함께 소멸됩니다.",
  },
  {
    title: "스폰서광고(5개 업체 한정)",
    amount: 400000,
    standard: "한달 기준",
    position: "PC : 홈페이지 첫화면 포함 모든 페이지 좌측 고정 노출",
    description:
      "pc 홈페이지 화면의 최상단,모바일 홈페이지 화면의 상단에 고정 노출되는 상품입니다. 특히 어떤 페이지로 이동하여도 지속적으로 노출되기 때문에 방문자의 클릭률이 가장 높습니다.",
  },
  {
    title: "지역별 배너광고",
    amount: 100000,
    standard: "지역 1개",
    position: "PC/모바일 지역별 업체검색, 해당 지역 페이지",
    description:
      "PC와 모바일 지역별 업체검색 페이지, 업체정보를 원하는 지역에 검색되도록 지역을 추가하는 서비스입니다. 많은 지역을 추가할수록 검색시 많이 노출 됩니다.",
  },
  {
    title: "상품별 배너광고",
    amount: 100000,
    standard: "상품 1개",
    position: "PC/모바일 상품별 업체검색, 해당 상품 페이지",
    description:
      "PC와 모바일 상품별 업체검색 페이지, 해당 상품 페이지에 노출되는 상품으로서, 조건에 맞는 상품별 업체를 찾는 방문자에게 효과적으로 노출되어 효율적인 광고효과를 누릴 수 있습니다.",
  },
  {
    title: "실시간대출문의 업체 등록 횟수",
    amount: 0,
    standard: "메인업체 등록시 한달 기준 200회 이용권",
    position: "",
    description:
      "실시간 대출문의를 남긴 고객의 정보를 직접 열람하고 귀사는 업체정보를 고객에게 실시간 문자 전송되는 서비스입니다.",
  },
  {
    title: "실시간대출문의 업체 등록 횟수 추가",
    amount: 200000,
    standard: "한달 기준 200회 이용권",
    position: "",
    description: "일일 사용횟수 제한 없음",
  },
  {
    title: "줄광고",
    amount: 200000,
    standard: "한달 기준 500회 이용권",
    position: "",
    description:
      "일일 사용횟수 제한 없음\n화면 하단에 한 줄로 노출되는 광고로, 다수의 업체가 있지만, 제공되는 점프기능 사용으로 효과적인 활용이 가능합니다.",
  },
].reverse();
