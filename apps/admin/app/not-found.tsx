"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function NotFound() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-8 align-middle">
      <h1 className="text-wc-444 mt-24 text-center text-3xl">
        원하시는 페이지를 찾을 수 없어요.
      </h1>
      <p className="text-wc-999 my-4 text-center">
        페이지 주소가 정확한지 다시 확인해주세요.
      </p>

      <div className="pt-5">
        <Button
          variant={"outline"}
          className="rounded-3xl px-12 py-6 text-lg"
          onClick={() =>
            router.replace(
              session.status === "authenticated"
                ? "/lender-ad-management"
                : "/sign-in"
            )
          }
        >
          홈으로
        </Button>
      </div>
    </div>
  );
}
