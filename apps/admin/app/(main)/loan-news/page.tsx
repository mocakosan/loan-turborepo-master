import { getLoanNewsList } from "@/actions/admin/get-loan-news-list";
import LoanNews from "./financial-news";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const query = params?.q || "";

  const { loanNewsList, meta } = await getLoanNewsList({
    page,
    query,
  });

  return <LoanNews loanNewsList={loanNewsList} meta={meta} />;
}
