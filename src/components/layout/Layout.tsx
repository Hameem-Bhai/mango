import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AgeGate } from './AgeGate';
import { CartSheet } from '@/components/cart/CartSheet';

import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { MobileBottomNav } from './MobileBottomNav';
import { CompareBar } from '@/components/product/CompareBar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF5E7] dark:bg-[#121212] transition-colors duration-200">
      <AgeGate />
      <CartSheet />
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <CompareBar />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}
