import Link from "next/link";

import {
  CalendarMinus2,
  ChartColumn,
  ChevronDown,
  Highlighter,
  Megaphone,
  SquareUserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import AppSidebarFooter from "./app-sidebar-footer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const items = [
  {
    title: "업체 및 광고 관리",
    url: "/lender-ad-management",
    icon: ChartColumn,
    subMenus: [
      {
        title: "업체 목록 및 광고 설정",
        url: "/lender-ad-management",
      },
    ],
  },
  {
    title: "방문자 관리",
    url: "/visitor",
    icon: ChartColumn,
    subMenus: [
      {
        title: "방문자 통계",
        url: "/visitor",
      },
    ],
  },
  {
    title: "실시간 대출업체",
    url: "/company-registration",
    icon: CalendarMinus2,
    subMenus: [
      {
        title: "등록된 대출업체 목록",
        url: "/company-registration",
      },
    ],
  },
  {
    title: "게시글 관리",
    url: "/loan-inquiry",
    icon: Highlighter,
    subMenus: [
      {
        title: "실시간 대출문의 현황",
        url: "/loan-inquiry",
      },
      {
        title: "금융권 소식",
        url: "/financial-news",
      },
      {
        title: "대부업소식",
        url: "/loan-news",
      },
      {
        title: "공지사항",
        url: "/notice",
      },
      {
        title: "1:1문의",
        url: "/inquiry",
      },
    ],
  },
  {
    title: "광고 관리",
    url: "/advertising-guide",
    icon: Megaphone,
    subMenus: [
      {
        title: "업체 이용안내",
        url: "/advertising-guide",
      },
      {
        title: "광고문의",
        url: "/advertising-inquiry",
      },
    ],
  },
  {
    title: "회원 관리",
    url: "/enterpriser",
    icon: SquareUserRound,
    subMenus: [
      {
        title: "회원 관리",
        url: "/enterpriser",
      },
      {
        title: "회원 가입 승인",
        url: "/enterpriser-status",
      },
    ],
  },
];

type Props = {
  email: string;
};

export default function AppSidebar({ email }: Props) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={`/lender-ad-management`}>
          <h1 className="text-[#07DF9A] font-bold">Admin</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <Collapsible
                  key={index}
                  className="group/collapsible"
                  defaultOpen
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <Link
                        href={item.url}
                        className="flex flex-row items-center"
                      >
                        <div className="flex flex-row gap-2 text-[#07DF9A] p-2">
                          <item.icon className="w-4 h-4" />
                          <span className="font-bold">{item.title}</span>
                        </div>

                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4 h-4" />
                      </Link>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subMenus.map((sub, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <SidebarMenuSubButton asChild>
                              <Link href={sub.url}>{sub.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>

            {/* <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} style={{ color: "#07DF9A" }}>
                      <item.icon />
                      <span style={{ fontWeight: "bold" }}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subMenus.map((sub, subIndex) => (
                      <SidebarMenuSubItem key={subIndex}>
                        <SidebarMenuSubButton asChild>
                          <Link href={sub.url}>{sub.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter email={email} />
    </Sidebar>
  );
}
