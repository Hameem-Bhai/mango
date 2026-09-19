import { Link, useLocation } from 'wouter';
import { 
  Search, ShoppingBag, Menu, Moon, Sun, X, ArrowRight, User, 
  ChevronDown, Package, Zap, Droplet, BatteryCharging, 
  HelpCircle, BookOpen, Building2, Phone, BarChart2, ShieldCheck, LogOut, MapPin
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/hooks/useCart';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { useComparison } from '@/hooks/useComparison';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';
import { DeveloperModal } from '@/components/ui/DeveloperModal';

export function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const { compareList } = useComparison();
  const [, setLocation] = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showDevModal, setShowDevModal] = useState(false);
  const logoClickTimeout = useRef<any>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (logoClickTimeout.current) clearTimeout(logoClickTimeout.current);
    const newCount = logoClickCount + 1;
    if (newCount >= 5) {
      e.preventDefault();
      setShowDevModal(true);
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      logoClickTimeout.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 1500);
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Disposables', href: '/shop/disposables', icon: Zap, desc: '6K to 15K Puffs' },
    { name: 'E-Liquids & Salts', href: '/shop/e-liquids', icon: Droplet, desc: '10ml, 30ml, 100ml, 120ml' },
    { name: 'Pod Kits', href: '/shop/pod-kits', icon: BatteryCharging, desc: 'Caliburn, XROS, Argus' },
    { name: 'Coils & Cartridges', href: '/shop/coils-tanks', icon: Package, desc: 'Pods & Replacement Coils' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-[#141414]/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800'}`}>
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo (Click 5x for Developer Credit Easter Egg) */}
        <Link href="/" onClick={handleLogoClick} className="flex items-center shrink-0 cursor-pointer select-none">
          <img src="/brand/logo-primary.png" alt="Mr. Mango" className="h-9 sm:h-11 w-auto object-contain dark:hidden" />
          <img src="/brand/logo-dark.png" alt="Mr. Mango" className="h-9 sm:h-11 w-auto object-contain hidden dark:block" />
        </Link>

        {/* Center: Desktop Navigation Bar with dropdowns */}
        <nav className="hidden xl:flex items-center gap-6">
          <Link href="/" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            Home
          </Link>

          {/* Shop Dropdown */}
          <div 
            className="relative" 
            ref={shopDropdownRef}
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <Link 
              href="/shop" 
              className="flex items-center gap-1 text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] py-2 transition-colors"
            >
              Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
            </Link>

            {shopDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link 
                  href="/shop"
                  onClick={() => setShopDropdownOpen(false)}
                  className="px-4 py-2 flex items-center justify-between text-xs font-bold text-[#FDA701] border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#222]"
                >
                  <span>Browse All Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="pt-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setShopDropdownOpen(false)}
                        className="px-4 py-2.5 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#FDA701]/10 text-[#FDA701] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1A1A1A] dark:text-white leading-tight">{cat.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{cat.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link href="/track-order" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            Track Order
          </Link>

          <Link href="/wholesale" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            Wholesale
          </Link>

          <Link href="/blog" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            Blog & Guides
          </Link>

          <Link href="/faq" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            FAQ
          </Link>

          <Link href="/about" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            About
          </Link>

          <Link href="/contact" className="text-[#1A1A1A] dark:text-gray-200 font-semibold text-sm hover:text-[#FDA701] dark:hover:text-[#FDA701] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Live Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100);
            }} 
            className="text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9"
            title="Search Products"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDark} 
            className="text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9" 
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun className="h-4 w-4 text-[#FDA701]" /> : <Moon className="h-4 w-4 text-gray-700" />}
          </Button>

          {/* Compare Button */}
          <Link href="/compare" className="hidden sm:inline-block">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9"
              title="Compare Products"
            >
              <BarChart2 className="h-4 w-4" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#076136] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Shopping Bag Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9" 
            onClick={toggleCart}
            title="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FDA701] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Account / User Button */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#FDA701] text-xs font-bold text-[#1A1A1A] dark:text-white transition-colors"
              >
                {isAdmin ? (
                  <span className="flex items-center gap-1 text-[#FDA701]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {user.name?.split(' ')[0] || 'Account'}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-left">
                    <p className="text-xs font-bold text-[#1A1A1A] dark:text-white truncate">{user.name || 'User'}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FDA701] hover:bg-gray-50 dark:hover:bg-[#222] rounded-lg mt-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    href="/track-order" 
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] rounded-lg"
                  >
                    <Package className="w-3.5 h-3.5" /> Track My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left mt-1 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openAuthModal}
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 text-xs font-bold rounded-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#FDA701] hover:text-[#FDA701]"
            >
              <User className="w-3.5 h-3.5" /> Sign In
            </Button>
          )}

          {/* Mobile Menu Trigger (Hamburger) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 xl:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FAF5E7] dark:bg-[#141414] dark:border-gray-800 w-84 p-6 overflow-y-auto max-h-screen">
              <div className="flex flex-col gap-6 mt-4 pb-12">
                
                {/* Brand Logo in Menu */}
                <div className="pb-4 border-b border-[#1A1A1A]/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <img src="/brand/logo-primary.png" alt="Mr. Mango" className="h-9 object-contain dark:hidden" />
                    <img src="/brand/logo-dark.png" alt="Mr. Mango" className="h-9 object-contain hidden dark:block" />
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Vape Shop BD</p>
                  </div>
                </div>

                {/* Mobile Auth Button */}
                <div className="bg-white dark:bg-[#1f1f1f] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#1A1A1A] dark:text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-gray-500">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <span className="text-[10px] bg-[#FDA701] text-black font-extrabold px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center py-2 bg-[#FDA701] text-black text-xs font-bold rounded-xl"
                        >
                          Go to Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={logout} 
                        className="text-xs text-red-500 font-semibold block text-center w-full pt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => { setMobileMenuOpen(false); openAuthModal(); }} 
                      className="w-full bg-[#FDA701] hover:bg-[#e59600] text-black font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <User className="w-4 h-4" /> Sign In / Register
                    </Button>
                  )}
                </div>

                {/* Section 1: Shop Categories */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shop by Category</p>
                  <div className="space-y-1">
                    <Link 
                      href="/shop" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-bold text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span>🛍️ All Products</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                    <Link 
                      href="/shop/disposables" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span>⚡ Disposables (Up to 15k Puffs)</span>
                    </Link>
                    <Link 
                      href="/shop/e-liquids" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span>🧪 E-Liquids & Salt Nicotine</span>
                    </Link>
                    <Link 
                      href="/shop/pod-kits" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span>🔋 Pod Kits & Devices</span>
                    </Link>
                    <Link 
                      href="/shop/coils-tanks" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span>⚙️ Replacement Pods & Cartridges</span>
                    </Link>
                  </div>
                </div>

                {/* Section 2: Orders & Customer Tools */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Orders & Services</p>
                  <div className="space-y-1">
                    <Link 
                      href="/track-order" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Package className="w-4 h-4 text-[#FDA701]" />
                      <span>Track BD Order</span>
                    </Link>
                    <Link 
                      href="/wholesale" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Building2 className="w-4 h-4 text-[#076136]" />
                      <span>Wholesale & Bulk Orders</span>
                    </Link>
                    <Link 
                      href="/compare" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <BarChart2 className="w-4 h-4 text-blue-500" />
                      <span>Compare Products ({compareList.length})</span>
                    </Link>
                  </div>
                </div>

                {/* Section 3: Information & Support */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Information & Outlets</p>
                  <div className="space-y-1">
                    <Link 
                      href="/blog" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>Vape Guides & Blog</span>
                    </Link>
                    <Link 
                      href="/faq" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                      <span>Frequently Asked Questions</span>
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span>About Mr. Mango BD</span>
                    </Link>
                    <Link 
                      href="/contact" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-sm text-[#1A1A1A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Contact & Kuril Outlet</span>
                    </Link>
                  </div>
                </div>

                {/* Outlet Footer Info */}
                <div className="pt-4 border-t border-[#1A1A1A]/10 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                  <p className="font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#076136] dark:text-green-400" /> Official Kuril Outlet:
                  </p>
                  <p className="text-[11px] font-medium text-[#1A1A1A] dark:text-gray-200">
                    2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka.
                  </p>
                  <p className="text-[11px] text-gray-500">⏰ 11:00 AM – 11:00 PM (Everyday)</p>
                  <p className="text-[11px] text-[#25D366] font-semibold">📞 Hotline / WhatsApp: +880 1880-031355</p>
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
      
      {/* Expandable Live Search Bar */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#181818] shadow-xl p-4 border-t border-gray-100 dark:border-gray-800 transition-all z-50">
          <div className="container mx-auto max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input 
                ref={searchInputRef}
                autoFocus 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, flavors (e.g. Bar Juice, 13000 puffs, Mango)..." 
                className="pl-10 pr-24 h-12 text-sm border-[#FDA701] focus-visible:ring-[#FDA701] bg-white dark:bg-[#222] dark:text-white rounded-xl" 
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button type="submit" size="sm" className="bg-[#FDA701] hover:bg-[#e59600] text-black font-bold text-xs h-8 px-3 rounded-lg">
                  Search
                </Button>
              </div>
            </form>

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2 bg-white dark:bg-[#222] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden divide-y divide-gray-100 dark:border-gray-800 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching catalog...</div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((prod) => (
                      <Link 
                        key={prod.id} 
                        href={`/product/${prod.slug}`}
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        className="p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#333] flex items-center justify-center shrink-0 p-1">
                          <img 
                            src={prod.imageUrl || '/brand/icon.png'} 
                            alt={prod.name} 
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/brand/icon.png'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#1A1A1A] dark:text-white truncate">{prod.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{prod.flavor || prod.brand || prod.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm text-[#FDA701]">৳{Math.round(prod.price).toLocaleString()}</p>
                          {prod.inStock === false && (
                            <span className="text-[10px] text-red-500 font-semibold">Sold Out</span>
                          )}
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="block p-3 text-center text-xs font-bold text-[#FDA701] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] bg-gray-50/50 dark:bg-[#1e1e1e]"
                    >
                      View all results for "{searchQuery}" <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No products found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Developer Credit Easter Egg Modal */}
      <DeveloperModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />
    </header>
  );
}
