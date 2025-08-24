import Detail from "./detail";
import { getInquiry } from "@/actions/admin/get-inquiry";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getInquiry(Number(id));

  return <Detail data={data} />;
}
