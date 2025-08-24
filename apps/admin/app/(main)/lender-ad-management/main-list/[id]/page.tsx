import { getLenderDetail } from "@/actions/admin/get-lender-detail";
import Detail from "./detail";
import { getRegionKinds } from "@/actions/admin/get-region-kinds";
import { getLoanKinds } from "@/actions/admin/get-loan-kinds";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [{ regionKinds }, { loanKinds }, data] = await Promise.all([
    getRegionKinds(),
    getLoanKinds(),
    getLenderDetail(Number(id)),
  ]);

  return <Detail data={data} regionKinds={regionKinds} loanKinds={loanKinds} />;
}
