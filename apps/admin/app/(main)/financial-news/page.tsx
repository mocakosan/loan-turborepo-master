import FinancialNews from "./financial-news";
import { getFinancialNewsList } from "@/actions/admin/get-financial-news-list";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const query = params?.q || "";

  const { financialNewsList, meta } = await getFinancialNewsList({
    page,
    query,
  });

  return <FinancialNews financialNewsList={financialNewsList} meta={meta} />;
}
