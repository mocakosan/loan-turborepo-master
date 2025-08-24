import { getRegionKinds } from "@/actions/admin/get-region-kinds";
import { getLoanKinds } from "@/actions/admin/get-loan-kinds";
import Add from "./add";

export default async function Page() {
  const [{ regionKinds }, { loanKinds }] = await Promise.all([
    getRegionKinds(),
    getLoanKinds(),
  ]);

  return <Add regionKinds={regionKinds} loanKinds={loanKinds} />;
}
