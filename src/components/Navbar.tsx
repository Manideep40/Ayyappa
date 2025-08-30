import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, Footprints, Users, Headphones, Calendar as CalendarIcon, CalendarCheck } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadAvatar() {
      if (!user) { setAvatarUrl(null); return; }
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      if (!active) return;
      setAvatarUrl((data as any)?.avatar_url ?? null);
    }
    void loadAvatar();
    return () => { active = false; };
  }, [user?.id]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pilgrimage", href: "#pilgrimage" },
    { name: "Community", href: "#community" },
    { name: "Audio", href: "/audio" },
    { name: "Calendar", href: "/darshan-booking" },
    { name: "Bookings", href: "/bookings" },
  ];

  const tabs = [
    { title: "Home", icon: Home },
    { title: "Pilgrimage", icon: Footprints },
    { title: "Community", icon: Users },
    { title: "Audio", icon: Headphones },
    { title: "Calendar", icon: CalendarIcon },
    { title: "Bookings", icon: CalendarCheck },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-sacred border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo (click to go Home) */}
          <button
            type="button"
            aria-label="Go to Home"
            title="Home"
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
          >
            <div className="w-10 h-10 bg-gradient-sacred rounded-full flex items-center justify-center shadow-sacred">
              <span className="text-white font-bold text-xl">ॐ</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-base md:text-lg leading-[1.3] text-sacred">{t("app.title")}</div>
              <div className="text-xs text-muted-foreground">Sacred Platform</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <ExpandableTabs
              tabs={tabs as any}
              className="border-none shadow-none bg-transparent"
              onChange={(index) => {
                if (index === null) return;
                const link = navLinks[index];
                if (!link) return;
                // Navigate to route or section
                if (link.href.startsWith("#")) {
                  // Ensure we land on home with the hash so Index can scroll
                  navigate(`/${link.href}`);
                } else {
                  navigate(link.href);
                }
              }}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageSwitcher />
            <ModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="h-8 w-8 border-2 border-amber-300 dark:border-amber-600">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback>{(user.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/login") }>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button variant="sacred" size="sm" onClick={() => navigate("/get-started") }>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary/20 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const href = link.href.startsWith('#') ? `/${link.href}` : link.href;
                return (
                <a
                  key={link.name}
                  href={href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              )})}
              <div className="flex flex-col space-y-3 pt-4 border-t border-primary/20">
                <div className="flex items-center gap-2">
                  <LanguageSwitcher compact />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Theme:</span>
                  <ModeToggle />
                </div>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-amber-300 dark:border-amber-600">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt="Profile" />
                          ) : (
                            <AvatarFallback>{(user.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm">Profile</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => { setIsMenuOpen(false); navigate('/profile'); }}>Profile</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => { setIsMenuOpen(false); logout(); }}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { setIsMenuOpen(false); navigate("/login"); }}>
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                    <Button variant="sacred" size="sm" onClick={() => { setIsMenuOpen(false); navigate("/get-started"); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
