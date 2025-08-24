import Detail from "./detail";
import { getEnterpriser } from "@/actions/admin/get-enterpriser";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getEnterpriser(Number(id));

  return <Detail data={data} />;
}
