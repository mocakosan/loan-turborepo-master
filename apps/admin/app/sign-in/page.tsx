import { Metadata, Viewport } from "next";

import SignInForm from "@/components/form/admin/sign-in";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "관리자 페이지",
  description: "관리자 페이지",
};

export default function SignInPage() {
  return (
    <div className="container relative flex h-svh max-w-none flex-col items-center justify-center px-4 lg:grid lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[#07DF9A]" />
        <div className="relative z-20 flex items-center text-lg font-medium text-white">
          Admin
        </div>
      </div>
      <div className="w-full lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col text-center">
            <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
