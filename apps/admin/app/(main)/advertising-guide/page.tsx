import AdvertisingGuide from "./advertising-guide";
import { getAdvertisingGuides } from "@/actions/admin/get-advertising-guides";

export default async function Page() {
  const data = await getAdvertisingGuides();

  return <AdvertisingGuide data={data} />;
}
