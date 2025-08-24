import { getLoanInquiry } from "@/actions/admin/get-loan-inquiry";
import Detail from "./detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getLoanInquiry(Number(id));

  return <Detail data={data} />;
}
