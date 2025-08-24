"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export default function ErrorContent() {
  const router = useRouter();

  return (
    <div className="absolute top-1/2 flex -translate-y-1/2 flex-col self-center text-center">
      <h1 className="text-wc-444 mt-24 text-center text-3xl">
        네트워크 통신을 실패했습니다.
      </h1>
      <p className="text-wc-999 my-4 text-center">관리자에게 문의해주세요.</p>

      <div className="pt-5">
        <Button
          variant={"outline"}
          className="rounded-3xl px-12 py-6 text-lg"
          onClick={() => router.refresh()}
        >
          새로고침
        </Button>
      </div>
    </div>
  );
}
