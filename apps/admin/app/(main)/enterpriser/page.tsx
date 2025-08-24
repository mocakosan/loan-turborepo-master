import { getEnterprisers } from "@/actions/admin/get-enterprisers";
import Enterpriser from "./enterpriser";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const query = params?.q || "";

  const { enterprisers, meta } = await getEnterprisers({
    page,
    query,
  });

  return <Enterpriser enterprisers={enterprisers} meta={meta} />;
}
