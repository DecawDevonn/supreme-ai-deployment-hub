import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bot, X, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose 
} from '@/components/ui/sheet';
import { NavButton } from './NavButton';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  navigationItems: Array<{ name: string, path: string }>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navigationItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <NavButton variant="ghost" size="icon">
          <span className="sr-only">Open menu</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </NavButton>
      </SheetTrigger>
      <SheetContent side="right" className="bg-black/95 border-l border-[#00FF41]/30">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bot className="w-6 h-6 mr-2 text-[#00FF41]" />
              <span className="text-lg font-display font-semibold text-white">
                DEVONN<span className="text-[#00FF41]">.AI</span>
              </span>
            </div>
            <SheetClose asChild>
              <NavButton variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </NavButton>
            </SheetClose>
          </div>
          
          <nav className="flex flex-col space-y-4 flex-1">
            {navigationItems.map(item => (
              <SheetClose asChild key={item.name}>
                <Link 
                  to={item.path} 
                  className={cn(
                    "px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-[#00FF41]/10 text-[#00FF41] border-l-2 border-[#00FF41] pl-3"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#00FF41]/20 mt-auto">
            {session ? (
              <SheetClose asChild>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Button
                  onClick={() => navigate('/login')}
                  variant="default"
                  className="w-full gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
