import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import adminAuthOptions from "@/lib/admin-auth.options";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebar from "./_components/app-sidebar/app-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(adminAuthOptions);
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider className="block md:flex">
      <AppSidebar email={session.user.email ?? "알 수 없음"} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
