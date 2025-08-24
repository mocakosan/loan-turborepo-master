import Detail from "./detail";
import { getAdvertisingGuide } from "@/actions/admin/get-advertising-guide";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getAdvertisingGuide(Number(id));

  return <Detail data={data} />;
}
