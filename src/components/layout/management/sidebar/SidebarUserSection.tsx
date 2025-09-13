// components/layout/management/sidebar/SidebarUserSection.tsx - User Section

'use client';

import { User, Settings, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useManagementLayout } from '../ManagementLayoutProvider';

export function SidebarUserSection() {
  const { sidebarCollapsed } = useManagementLayout();
  // Mock session since next-auth is removed
  const session = null;

  const handleSignOut = async () => {
    console.log('Sign out functionality removed');
  };

  if (!sidebarCollapsed) {
    return (
      <div className="p-4 border-t border-[#202020]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] p-3"
            >
              <User className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left truncate">
                <p className="text-sm font-medium text-[#EDECF8] truncate">
                  User
                </p>
                <p className="text-xs text-[#575757] truncate">
                  user@example.com
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-[#171717] border-[#575757] w-56"
            align="start"
            side="top"
          >
            <DropdownMenuItem className="cursor-pointer text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#575757]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-[#202020]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Collapsed version
  return (
    <div className="p-4 border-t border-[#202020]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
          >
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-[#171717] border-[#575757] w-56"
          align="start"
          side="right"
        >
          <div className="px-2 py-1.5 text-sm">
            <p className="font-medium text-[#EDECF8]">
              User
            </p>
            <p className="text-xs text-[#575757]">
              user@example.com
            </p>
          </div>
          <DropdownMenuSeparator className="bg-[#575757]" />
          <DropdownMenuItem className="cursor-pointer text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#575757]" />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-[#202020]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}