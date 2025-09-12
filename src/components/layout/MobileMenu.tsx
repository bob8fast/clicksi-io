'use client'

import { ChevronDown, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleBasedMenuItems } from '@/config/menu-config';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: any[];
  isAuthenticated: boolean;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  navItems, 
  isAuthenticated,
  onLoginClick,
  onRegisterClick 
}: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  // Mock session since next-auth is removed
  const session = null;
  const router = useRouter();

  const toggleExpand = (itemLabel: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
  };

  const handleSignOut = async () => {
    console.log('Sign out functionality removed');
    router.push('/');
    onClose();
  };

  // Get role-based menu items using shared config (empty since no session)
  const roleBasedMenuItems = getRoleBasedMenuItems(null, null);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-80 bg-[#090909] border-[#202020] p-0"
      >
        <SheetHeader className="p-4 border-b border-[#202020]">
          <SheetTitle className="text-[#EDECF8] text-lg font-semibold">
            Menu
          </SheetTitle>
        </SheetHeader>
        
        {/* Main content area with scrolling */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full max-h-[calc(100vh-8rem)]">
            <div className="p-4">
              <div className="space-y-2">
                {/* Role-based menu items */}
                {isAuthenticated && roleBasedMenuItems.length > 0 && (
                  <>
                    <div className="pb-2">
                      <h3 className="text-xs font-semibold text-[#828288] uppercase mb-2 px-2">
                        Dashboard
                      </h3>
                      {roleBasedMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center py-3 px-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-[#575757] py-2" />
                  </>
                )}
                
                {/* Navigation Items */}
                <div className="pb-2">
                  <h3 className="text-xs font-semibold text-[#828288] uppercase mb-2 px-2">
                    Navigation
                  </h3>
                  {navItems.map((item) => (
                    <div key={item.href}>
                      {item.submenu && item.submenu.length > 0 ? (
                        <>
                          <button
                            onClick={() => toggleExpand(item.label)}
                            className="w-full flex items-center justify-between py-3 px-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
                          >
                            <span className="flex items-center">
                              {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                              {item.label}
                            </span>
                            {expandedItems[item.label] ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </button>
                          
                          {expandedItems[item.label] && (
                            <div className="ml-8 mt-1 space-y-1">
                              {item.submenu.map((subItem: any) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={onClose}
                                  className="block py-2 px-2 text-[#575757] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors text-sm"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center py-3 px-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
                        >
                          {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* User Profile Section (if authenticated) */}
                {isAuthenticated && (
                  <>
                    <div className="border-t border-[#575757] py-2" />
                    <div className="pb-2">
                      <h3 className="text-xs font-semibold text-[#828288] uppercase mb-2 px-2">
                        Account
                      </h3>
                      <Link
                        href="/profile"
                        onClick={onClose}
                        className="flex items-center py-3 px-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
                      >
                        <User className="mr-3 h-5 w-5" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={onClose}
                        className="flex items-center py-3 px-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Auth Section at Bottom */}
        <div className="p-4 bg-[#090909] border-t border-[#202020] flex-shrink-0 mt-auto">
          <div className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center w-full py-3 px-4 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onLoginClick?.();
                  }}
                  className="flex items-center justify-center py-3 px-4 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors border border-[#575757]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onRegisterClick?.();
                  }}
                  className="flex items-center justify-center py-3 px-4 bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold rounded-lg transition-colors"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}