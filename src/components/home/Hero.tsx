import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Star, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-[#FDA701] overflow-hidden border-b border-[#1A1A1A]/10">
      <div className="container mx-auto px-4 pt-6 pb-16 lg:pb-24 max-w-5xl">
        
        {/* BIG HERO LOGO - DIRECTLY ON THE BACKGROUND */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <img 
            src="/brand/logo-primary.png" 
            alt="Mr. Mango - Your Favorite Vape Shop in BD" 
            className="w-full max-w-[320px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] h-auto object-contain drop-shadow-sm select-none"
          />
        </div>

        {/* HERO TEXT SECTION */}
        <div className="max-w-3xl text-left">
          
          {/* Overline */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
            YOUR VAPE SHOP
          </p>

          {/* Main Headline */}
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.08] tracking-tight mb-4">
            Your favorite vape shop in 🇧🇩
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-[#1A1A1A]/90 font-normal leading-relaxed mb-8 max-w-2xl">
            Mr.Mango.com curates disposables, pod kits, and e-liquids from the brands vapers actually ask for — so you can compare, restock, and order in one trip.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/shop">
              <Button className="bg-[#1A1A1A] hover:bg-black text-[#FAF5E7] px-8 py-6 text-base sm:text-lg font-bold rounded-xl shadow-md transition-transform hover:-translate-y-0.5">
                Shop Products
              </Button>
            </Link>
            <a href="#outlets">
              <Button variant="outline" className="border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-7 py-6 text-base sm:text-lg font-bold rounded-xl bg-transparent transition-all">
                <MapPin className="h-5 w-5 mr-2 text-[#076136]" /> Kuril Outlet (Beside AIUB)
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1A1A1A]/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#1A1A1A] shrink-0" />
              <div>
                <p className="font-bold text-sm text-[#1A1A1A]">100% Authentic Brands</p>
                <p className="text-xs text-[#1A1A1A]/70">Scratch verified codes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-[#1A1A1A] shrink-0" />
              <div>
                <p className="font-bold text-sm text-[#1A1A1A]">Fast BD Delivery</p>
                <p className="text-xs text-[#1A1A1A]/70">Same-day inside Dhaka</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-[#1A1A1A] shrink-0" />
              <div>
                <p className="font-bold text-sm text-[#1A1A1A]">Physical Outlet</p>
                <p className="text-xs text-[#1A1A1A]/70">Kuril (Beside AIUB)</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
