import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { useEffect } from 'react';
import { useStore } from '@/store/use-store';
import { useShallow } from 'zustand/react/shallow';
import { Button } from './ui/button';
import { Sun, Moon, ArrowLeftRight, LogOut } from 'lucide-react';

type SidebarProps = {
  children: React.ReactNode;
};

const Sidebar = ({ children }: SidebarProps) => {
  const { isDarkMode, isRtl, updateDarkMode, updateRTL, updateAuthState } = useStore(
    useShallow((state) => ({
      isDarkMode: state.isDarkMode,
      isRtl: state.isRtl,
      updateDarkMode: state.updateDarkMode,
      updateRTL: state.updateRTL,
      updateAuthState: state.updateAuthState,
    })),
  );

  useEffect(() => {
    const html = document.documentElement;
    const root = document.getElementById('root')!;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    if (isRtl) {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
  }, [isDarkMode, isRtl]);

  return (
    <div className="flex min-h-screen w-12 flex-col items-center gap-2 bg-secondary px-1">
      <div className="flex w-full flex-col items-center gap-1 text-clip">
        <TooltipWrapper label={isDarkMode ? 'Dark mode' : 'Light mode'}>
          <Button className="p-2" onClick={() => updateDarkMode(!isDarkMode)}>
            {isDarkMode ? <Moon /> : <Sun />}
          </Button>
        </TooltipWrapper>
        <TooltipWrapper label={isRtl ? 'LTR mode' : 'RTL mode'}>
          <Button className="p-2" onClick={() => updateRTL(!isRtl)}>
            <ArrowLeftRight />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper label="Log Out">
          <Button
            className="p-2"
            onClick={() => {
              updateAuthState({ status: 'LoggedOut', userId: undefined });
            }}
          >
            <LogOut />
          </Button>
        </TooltipWrapper>
      </div>
      <div className="flex w-full flex-col items-center gap-1 text-clip">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
