import {
  BookOpen,
  Bot,
  Command,
  FileText,
  Frame,
  LifeBuoy,
  type LucideIcon,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import * as React from 'react';
import dalilLogo from '@/assets/img/logo-round.png';
import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { FileRouteTypes } from '@/routeTree.gen';
import { useStore } from '@/store/use-store';
import { useShallow } from 'zustand/react/shallow';
import { Link } from '@tanstack/react-router';
import { it } from 'date-fns/locale';

type PageItem = {
  url: FileRouteTypes['fullPaths'];
  title: string;
  params?: Record<string, string>;
};

type NavItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: PageItem[];
};
export const navMain: NavItem[] = [
  {
    id: 'procedures',
    title: 'الإجراءات',
    icon: FileText,
    items: [
      {
        title: 'عرض حالة المشتركين',
        url: '/beneficiary-status',
      },
      {
        title: 'حجز قيمة خدمة',
        url: '/beneficiary-balance-inquiry',
      },
      {
        title: 'حجز قيمة خدمة (تجريبي)',
        url: '/process-balance-inquiry',
      },
      {
        title: 'سجل حجز القيمة',
        url: '/balance-reservation-log',
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const userRole = useStore(useShallow((state) => state.role));

  // Example: Only include items with id 'personal' or 'company'
  const userNavMain = navMain;

  return (
    <Sidebar
      className="h-dvh"
      variant="inset"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <Link
                className="flex items-center justify-between gap-2 p-4"
                to="/"
              >
                <div className="grid flex-1 text-end text-sm leading-tight">
                  <span className="truncate font-semibold">
                    شركة الدلـيل الشافي
                  </span>
                  <span className="truncate text-xs">
                    منظـومة بوابة العيادات
                  </span>
                </div>
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground"> */}
                {/* <Command className="size-4" /> */}
                <img
                  src={dalilLogo}
                  alt="Dalil Logo"
                  className="size-12"
                />
                {/* <img src={dalilNameLogoH} alt="Dalil Name Logo" className="h-28" /> */}
                {/* </div> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={userNavMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
