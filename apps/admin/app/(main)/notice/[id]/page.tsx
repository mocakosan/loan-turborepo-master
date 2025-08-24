import { getNotice } from "@/actions/admin/get-notice";
import Detail from "./detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getNotice(Number(id));

  return <Detail data={data} />;
}
