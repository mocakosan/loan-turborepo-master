import { getAllVisitor } from "@/actions/admin/visitor/get-all-visitor";
import Visitor from "./visitor";

export default async function Page() {
  const data = await getAllVisitor();

  return <Visitor data={data} />;
}
