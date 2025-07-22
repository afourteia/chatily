import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LanguagesIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import demoUser from '@/assets/img/demoUser.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useStore } from '@/store/use-store';
import { Link } from '@tanstack/react-router';

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  direction: 'ltr' | 'rtl';
  onDirectionChange: (direction: 'ltr' | 'rtl') => void;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const updateLogin = useStore((state) => state.updateAuthState);
  const resetStore = useStore((state) => state.reset);
  const authState = useStore((state) => state.authState);
  const { setOpenMobile } = useSidebar();

  let displayName = 'مجهول';
  let displayPhone = '09########';
  let email = 'anon@domain.com';
  console.log('authState', authState);
  if (authState.status === 'LoggedIn') {
    displayName = authState.name
    displayPhone = authState.phone || '09########';
    email = authState.email || 'anon@domain.com';
  }


  const toggleDirection = () => {
    console.log('🚀 ~ NavUser ~ toggleDirection');
    // onDirectionChange(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  const handleLogout = () => {
    resetStore();
    // updateLogin(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={demoUser} alt={displayName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="leading-left grid flex-1 text-start text-sm">
                <span className="truncate font-semibold">
                  {displayName}
                </span>
                <span className="truncate text-xs">{displayPhone}</span>
              </div>
              <ChevronsUpDown className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={'demoUser.png'} alt={displayName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs">{displayPhone}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  to="/account-info"
                  // activeProps={{ className: `font-bold` }}
                  // preload="intent"
                  onClick={() => {
                    setOpenMobile(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BadgeCheck />
                    تغيـر الرمـز السري
                  </div>
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem onClick={toggleDirection}>
                <LanguagesIcon />
                {direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
