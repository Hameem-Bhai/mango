import { Link, useLocation } from 'wouter';
import { Home, ShoppingBag, ShoppingCart, Truck, MessageCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function MobileBottomNav() {
  const [location] = useLocation();
  const { items } = useCart();
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: cartItemCount },
    { name: 'Track', path: '/track-order', icon: Truck },
    { 
      name: 'WhatsApp', 
      path: 'https://wa.me/8801880031355?text=Hi!%20I%20have%20an%20inquiry%20for%20Mr.%20Mango%20Kuril%20Outlet.', 
      icon: MessageCircle,
      isExternal: true,
      color: 'text-[#25D366]'
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/95 dark:bg-[#121212]/95 border-t border-gray-200/80 dark:border-gray-800/80 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,4px)]"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          if (item.isExternal) {
            return (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center flex-1 h-full py-1 text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#25D366]" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#25D366] mt-0.5 tracking-tight">
                  {item.name}
                </span>
              </a>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 relative active:scale-90 transition-all ${
                isActive 
                  ? 'text-[#FDA701] font-bold' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#e2136e] text-white text-[10px] font-black h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#FDA701]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
