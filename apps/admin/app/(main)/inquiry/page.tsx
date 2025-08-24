import { getInquiries } from "@/actions/admin/get-inquiries";
import Inquiry from "./inquiry";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const query = params?.q || "";

  const { inquiries, meta } = await getInquiries({
    page,
    query,
  });

  return <Inquiry inquiries={inquiries} meta={meta} />;
}
