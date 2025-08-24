import { getLoanInquiries } from "@/actions/admin/get-loan-inquiries";
import LoanInquiry from "./loan-inquiry";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const query = params?.q || "";

  const { loanInquiries, meta } = await getLoanInquiries({
    page,
    query,
  });

  return <LoanInquiry loanInquiries={loanInquiries} meta={meta} />;
}
