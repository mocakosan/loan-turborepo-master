import { InquiryKind } from "@repo/db";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setComma(value: number | string): string {
  if (value === null || value === undefined) return "0";

  const number = typeof value === "string" ? Number(value) : value;

  if (isNaN(number)) return "0";

  return number.toLocaleString("ko-KR");
}

export const convertInquiryKindToKor = (value: InquiryKind) => {
  switch (value) {
    case "PARTNERSHIP":
      return "제휴문의";

    case "ADVERTISING":
      return "광고문의";

    case "NOTICE":
      return "공지사항문의";

    case "OTHER":
      return "기타문의";

    case "SUGGESTION":
      return "건의사항";

    case "REPORT":
      return "신고하기";

    case "ERROR":
      return "오류신고";

    case "DELETE_LOAN_INQUIRY":
      return "실시간대출문의 글삭제";

    default:
      return "";
  }
};
