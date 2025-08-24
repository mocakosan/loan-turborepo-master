import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

export default function useReferralCode() {
  const searchParams = useSearchParams();

  const [referralCode, setReferralCode] = useState<string>();

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      sessionStorage.setItem("referralCode", ref);
      setReferralCode(ref);
    } else {
      const value = sessionStorage.getItem("referralCode");
      if (value) {
        setReferralCode(value);
      } else {
        setReferralCode(undefined);
      }
    }
  }, [searchParams]);

  return referralCode;
}
