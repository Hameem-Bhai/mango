import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MapPin } from 'lucide-react';

export function OutletStatusBadge({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      // BD time UTC+6
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bdDate = new Date(utc + 3600000 * 6);
      const hour = bdDate.getHours();
      // Open 11:00 AM (11) to 11:00 PM (23)
      setIsOpen(hour >= 11 && hour < 23);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <Link href="/about" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors">
        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        <span className={isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
          {isOpen ? 'Kuril Open' : 'Opens 11 AM'}
        </span>
      </Link>
    );
  }

  return (
    <Link 
      href="/about" 
      className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors group"
      title="Mr. Mango Kuril Outlet (Beside AIUB Main Gate)"
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </span>

      <span className="text-gray-900 dark:text-gray-100 flex items-center gap-1">
        <MapPin className="w-3 h-3 text-[#076136] dark:text-emerald-400" />
        <span className="font-bold">Kuril Outlet:</span>
        <span className={isOpen ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
          {isOpen ? 'Open Now (Closes 11 PM)' : 'Closed (Opens 11 AM)'}
        </span>
      </span>
    </Link>
  );
}
