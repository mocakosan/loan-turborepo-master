import { getNotices } from "@/actions/admin/get-notices";
import Notice from "./notice";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const query = params?.q || "";

  const { notices, meta } = await getNotices({
    page,
    query,
  });

  return <Notice notices={notices} meta={meta} />;
}
