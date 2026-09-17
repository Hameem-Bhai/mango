import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, MapPin, Check } from 'lucide-react';
import { PaymentMethods } from '@/components/payment/PaymentMethods';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() })
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] dark:bg-[#0d0d0d] text-[#FAF5E7] dark:text-gray-200 pt-16 pb-8 border-t-2 border-[#FDA701] transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          <div className="lg:col-span-1">
            <img src="/brand/logo-dark.png" alt="Mr. Mango" className="h-12 mb-4 object-contain" />
            <p className="text-gray-400 dark:text-gray-400 mb-4 text-sm leading-relaxed">
              <strong>Your favorite vape shop in BD.</strong> 100% authentic devices, liquids & accessories with fast delivery across Bangladesh.
            </p>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-[#FDA701]"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#FDA701]"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#FDA701]"><Instagram className="h-5 w-5" /></a>
            </div>
            <div className="text-xs text-gray-400 bg-white/5 dark:bg-white/[0.03] p-2.5 rounded-lg border border-white/10 dark:border-gray-800">
              <p className="font-semibold text-white mb-2">Payment Options in BD:</p>
              <PaymentMethods />
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Our Outlet</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-white/10 dark:border-gray-800">
                <p className="font-bold text-[#FDA701] flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-[#076136] bg-[#FDA701] rounded-full p-0.5" /> Mr. Mango Kuril Outlet
                </p>
                <p className="text-gray-300 text-xs mt-2 font-medium leading-relaxed">
                  2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka.
                </p>
                <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span> 11:00 AM – 11:00 PM (Daily)
                </p>
                <a 
                  href="https://wa.me/8801700000000?text=Hi! I want to visit Mr. Mango Kuril Outlet." 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:underline"
                >
                  WhatsApp: +880 1700-000000
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop/disposables" className="text-gray-400 hover:text-[#FDA701]">Disposables</Link></li>
              <li><Link href="/shop/pod-kits" className="text-gray-400 hover:text-[#FDA701]">Pod Kits</Link></li>
              <li><Link href="/shop/e-liquids" className="text-gray-400 hover:text-[#FDA701]">E-Liquids & Salts</Link></li>
              <li><Link href="/shop/coils-tanks" className="text-gray-400 hover:text-[#FDA701]">Coils & Accessories</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-[#FDA701]">All Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support & Info</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-[#FDA701]">About Mr. Mango</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-[#FDA701]">Vape Guides & Blog</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-[#FDA701]">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#FDA701]">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-[#FDA701]">Track BD Order</Link></li>
              <li><Link href="/wholesale" className="text-gray-400 hover:text-[#FDA701]">Wholesale & Bulk</Link></li>
              <li><Link href="/compare" className="text-gray-400 hover:text-[#FDA701]">Product Comparison</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-white">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive BD discounts, new arrivals, and giveaway announcements.</p>
            {subscribed ? (
              <div className="bg-[#FDA701]/10 border border-[#FDA701]/30 rounded-lg p-3 text-center text-[#FDA701] text-sm font-semibold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <Input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-[#FDA701]" 
                />
                <Button disabled={submitting} type="submit" className="w-full bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold">
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10 dark:border-gray-800 pt-8 text-center text-sm text-gray-500">
          <div className="mb-6 border border-white/10 dark:border-gray-800 p-4 max-w-3xl mx-auto rounded-xl bg-white/5 dark:bg-white/[0.02]">
            <p className="font-bold text-white uppercase tracking-wider text-xs">WARNING: This product contains nicotine. Nicotine is an addictive chemical. 18+ / 21+ Only.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 mt-4 pt-4 border-t border-white/5">
            <p>© {new Date().getFullYear()} Mr.Mango.com — Your Favorite Vape Shop in BD. All rights reserved.</p>
            <p className="flex items-center gap-1.5 flex-wrap justify-center">
              <span>Crafted &amp; Developed by</span>
              <a 
                href="https://hameembhaierdokan.studio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FDA701] font-bold hover:underline transition-colors"
              >
                Hameem Bhai
              </a>
              <span className="text-gray-600">|</span>
              <a 
                href="https://hameembhaierdokan.studio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                hameembhaierdokan.studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
