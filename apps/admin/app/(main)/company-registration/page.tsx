import { getAllEnterpriser } from "@/actions/admin/loan-inquiry-registration/get-all-enterpriser";
import CompanyRegistration from "./company-registration";

export default async function Page() {
  const data = await getAllEnterpriser();

  return <CompanyRegistration data={data} />;
}
