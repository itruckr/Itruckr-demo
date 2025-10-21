import { LogOut, Settings, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { navItems, useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';

import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

export function SideBar() {
  const { activePage, setActivePage, sidebarCollapsed, setSidebarCollapsed } =
    useNavigation();
  const { logout, currentUser } = useAuth()

  const [isDesktop, setIsDesktop] = useState(false);

  // Memoized styles
  const styles = useMemo(
    () => ({
      buttonBase:
        'flex items-center w-full text-left py-2 rounded-full transition-all duration-300 relative overflow-hidden focus-visible:ring-green-accent ',
      buttonHover:
        'text-absolute-gray-300 hover:text-absolute-white hover:bg-absolute-black-hover',
      buttonActive: 'bg-green-accent text-absolute-black font-semibold',
      sidebarWidth: sidebarCollapsed ? 'w-16' : 'w-64',
    }),
    [sidebarCollapsed]
  );

  // Track screen size with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkScreenSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsDesktop(window.innerWidth >= 1024);
      }, 100);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Auto-collapse on mobile when switching to mobile view
  useEffect(() => {
    if (!isDesktop && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [isDesktop, sidebarCollapsed, setSidebarCollapsed]);

  const handleNavigation = useCallback(
    (itemId: string) => {
      setActivePage(itemId as any);

      if (!isDesktop) {
        setSidebarCollapsed(true);
      }
    },
    [setActivePage, isDesktop, setSidebarCollapsed]
  );

  const handleOverlayClick = useCallback(() => {
    setSidebarCollapsed(true);
  }, [setSidebarCollapsed]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, action: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action();
      }
    },
    []
  );

  // Navigation item component
  const NavItem = ({ item }: { item: (typeof navItems)[number] }) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;

    const navButton = (
      <button
        onClick={() => handleNavigation(item.id)}
        onKeyDown={e => handleKeyDown(e, () => handleNavigation(item.id))}
        className={cn(
          styles.buttonBase,
          isActive ? styles.buttonActive : styles.buttonHover
        )}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Navigate to ${item.label}`}
      >
        <div
          className={cn(
            'flex items-center justify-start w-full transition-all duration-300',
            sidebarCollapsed ? 'gap-0 pl-2.5' : 'gap-3 pl-3'
          )}
        >
          <Icon className='h-5 w-5 shrink-0' aria-hidden='true' />
          <span
            className={cn(
              'flex-1 transition-all duration-300 whitespace-nowrap',
              sidebarCollapsed
                ? 'w-0 opacity-0 overflow-hidden'
                : 'w-auto opacity-100'
            )}
          >
            {item.label}
          </span>
        </div>
      </button>
    );

    return sidebarCollapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>{navButton}</TooltipTrigger>
        <TooltipContent side='right' sideOffset={16}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    ) : (
      navButton
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && !isDesktop && (
        <div
          className='fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
          onClick={handleOverlayClick}
          onKeyDown={e => handleKeyDown(e, handleOverlayClick)}
          role='button'
          tabIndex={0}
          aria-label='Close sidebar'
        />
      )}

      {/* SideBar */}
      <aside
        className={cn(
          styles.sidebarWidth,
          'bg-absolute-black rounded-2xl py-5 px-3 transition-all duration-300 flex flex-col relative gap-6 shadow-2xl',
          'fixed left-0 top-0 z-50 h-full lg:relative lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2',
          !isDesktop && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        )}
        role='complementary'
        aria-label='Main navigation sidebar'
      >
        {/* Header with logo */}
        <header className='flex items-center justify-between'>
          <Logo
            width={60}
            height={40}
            className={cn(
              'transition-all',
              sidebarCollapsed
                ? 'delay-100 translate-x-0'
                : 'delay-0 translate-x-2'
            )}
          />
        </header>

        {/* Navigation */}
        <nav className='flex-1' role='navigation' aria-label='Main navigation'>
          <ul className='space-y-2' role='list'>
            {navItems.filter(
              item => currentUser?.id === '5' ? item.id === 'call-form' : true
            )
            .map(item => (
              <li key={item.id} role='listitem'>
                <NavItem item={item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* User menu */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(styles.buttonBase, styles.buttonHover)}
                  aria-label='User menu'
                >
                  <div
                    className={cn(
                      'flex items-center justify-start w-full transition-all duration-300',
                      sidebarCollapsed ? 'gap-0 pl-1' : 'gap-3 pl-2'
                    )}
                  >
                    <Avatar className='h-8 w-8 flex-shrink-0'>
                      <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.name} />
                      <AvatarFallback className='bg-custom-primary-accent text-black text-xs'>
                        {currentUser?.initials}
                      </AvatarFallback>
                    </Avatar>
                    {!sidebarCollapsed && (
                      <div
                        className={cn(
                          'flex flex-col items-start text-left transition-all duration-300 overflow-hidden min-w-0 flex-1',
                          sidebarCollapsed
                            ? 'w-0 opacity-0'
                            : 'w-auto opacity-100'
                        )}
                      >
                        <span className='text-sm font-medium text-absolute-gray-200 whitespace-nowrap truncate max-w-full'>
                          {currentUser?.name}
                        </span>
                        <span className='text-xs text-absolute-gray-400 whitespace-nowrap truncate max-w-full opacity-75'>
                          {currentUser?.role}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side='right' sideOffset={16}>
                <div className='text-center'>
                  <div className='font-medium'>{currentUser?.name}</div>
                  <div className='text-xs opacity-75'>{currentUser?.role}</div>
                </div>
              </TooltipContent>
            )}
          </Tooltip>

          <DropdownMenuContent
            className='w-56 bg-custom-surface border-custom-border'
            align='end'
            side='right'
            sideOffset={8}
          >
            {sidebarCollapsed && (
              <>
                <div className='px-2 py-1.5 text-sm'>
                  <div className='font-medium text-custom-text-primary'>
                    {currentUser?.name}
                  </div>
                  <div className='text-xs text-custom-text-secondary'>
                    {currentUser?.role}
                  </div>
                </div>
                <DropdownMenuSeparator className='bg-custom-border' />
              </>
            )}
            <DropdownMenuItem className='text-custom-text-primary hover:bg-custom-surface-hover focus:bg-custom-surface-hover'>
              <User className='h-4 w-4' aria-hidden='true' />
              <span className='ml-2'>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className='text-custom-text-primary hover:bg-custom-surface-hover focus:bg-custom-surface-hover'>
              <Settings className='h-4 w-4' aria-hidden='true' />
              <span className='ml-2'>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className='bg-custom-border' />
            <DropdownMenuItem
              className='cursor-pointer text-custom-error hover:bg-custom-surface-hover focus:bg-custom-surface-hover'
              onClick={() => logout()}
            >
              <LogOut className='h-4 w-4' aria-hidden='true' />
              <span className='ml-2'>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>
    </>
  );
}
