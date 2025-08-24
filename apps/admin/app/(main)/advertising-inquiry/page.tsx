import AdvertisingInquiry from "./advertising-inquiry";
import { getAdvertisingInquiries } from "@/actions/admin/get-advertising-inquiries";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;

  const { advertisingInquiries, meta } = await getAdvertisingInquiries({
    page,
  });

  return (
    <AdvertisingInquiry
      advertisingInquiries={advertisingInquiries}
      meta={meta}
    />
  );
}
