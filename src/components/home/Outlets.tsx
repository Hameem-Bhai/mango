import { MapPin, Phone, Clock, ShoppingBag, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FadeIn } from '@/components/ui/FadeIn';

export function Outlets() {
  const outlet = {
    name: 'Mr. Mango Kuril Outlet',
    badge: 'Official Outlet',
    address: '2nd Floor, Tong Market, Kuril, Beside Main Gate of AIUB, Dhaka, Bangladesh',
    hours: '11:00 AM – 11:00 PM (Open 7 Days)',
    phone: '+880 1700-000000',
    whatsapp: '+880 1700-000000',
    description: 'Our physical outlet conveniently located right beside AIUB main gate in Kuril. Visit us for 100% authentic disposable vapes, imported e-liquids, refillable pod kits, coils, and device testing.',
    features: [
      'Beside AIUB Main Gate',
      'In-Store Device Testing',
      'Instant Pickup',
      'Full Flavor Bar',
      'Cash / bKash Accepted'
    ]
  };

  return (
    <section id="outlets" className="py-16 bg-[#FAF5E7] dark:bg-[#121212] border-y border-[#1A1A1A]/10 dark:border-gray-800 transition-colors">
      <FadeIn>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#076136]/10 text-[#076136] dark:text-green-400 font-bold text-xs uppercase tracking-wider mb-3">
              <MapPin className="h-3.5 w-3.5" /> Physical Store in Dhaka
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
              Visit Our Kuril Outlet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Prefer to see and test your device in person? Drop by our physical store beside the AIUB Main Gate or order online for same-day delivery across Bangladesh!
            </p>
          </div>

          {/* Single Outlet Feature Card */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-800 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FDA701]/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDA701] text-black uppercase tracking-wide">
                  {outlet.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-white mt-3 mb-3 flex items-center gap-2.5">
                  <MapPin className="h-6 w-6 text-[#076136] shrink-0" />
                  {outlet.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {outlet.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {outlet.features.map((feat, fIdx) => (
                    <span key={fIdx} className="text-xs bg-[#076136]/10 text-[#076136] dark:text-green-400 font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" /> {feat}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a 
                    href="https://wa.me/8801700000000?text=Hi! I want to visit Mr. Mango Kuril Outlet." 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold h-12 px-6">
                      WhatsApp Outlet
                    </Button>
                  </a>
                  <Link href="/contact" className="flex-1 sm:flex-initial">
                    <Button variant="outline" className="w-full border-gray-300 dark:border-gray-700 h-12 px-6">
                      View Directions
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Outlet Details Box */}
              <div className="bg-gray-50 dark:bg-[#222] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#076136] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Exact Location:</strong>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#076136] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Opening Hours:</strong>
                    <span className="text-gray-700 dark:text-gray-300">{outlet.hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#076136] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white block font-bold">Outlet Helpline:</strong>
                    <span className="text-gray-700 dark:text-gray-300">{outlet.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Landmark: Right beside the American International University-Bangladesh (AIUB) Main Gate in Kuril.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery banner */}
          <div className="mt-8 bg-[#1A1A1A] text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-[#FDA701] flex items-center justify-center text-[#1A1A1A] shrink-0 font-bold text-lg">
                ৳
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF5E7]">Can't visit our Kuril outlet in person?</h4>
                <p className="text-xs text-gray-300">We offer same-day express delivery across Dhaka and 2-3 days delivery all over Bangladesh.</p>
              </div>
            </div>
            <Link href="/shop">
              <Button className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold px-5 h-11 whitespace-nowrap text-xs sm:text-sm">
                Shop Online Now
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
