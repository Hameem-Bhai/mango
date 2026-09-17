import { SEO } from '@/components/SEO';
import { CheckCircle2, Truck, ShieldCheck, Headphones, MapPin, Clock, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function About() {
  return (
    <>
      <SEO 
        title="About Us — Your Favorite Vape Shop in BD | Mr. Mango" 
        description="Learn about Mr. Mango — Bangladesh's premier vape retailer with our official physical outlet in Kuril (beside AIUB gate), Dhaka. 100% authentic devices, liquids, and fast nationwide delivery."
      />
      
      {/* Hero Section */}
      <div className="bg-[#1A1A1A] text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FDA701] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider mb-4">
            🇧🇩 Bangladesh's Trusted Vape Destination
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FAF5E7]">
            Your favorite vape shop in bd.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Welcome to <strong>Mr. Mango</strong>! We are dedicated to providing adult vapers in Bangladesh with the highest quality, 100% authentic disposable vapes, refillable pod kits, imported e-liquids, and coils. Visit our physical outlet in <strong>Kuril (Beside AIUB Main Gate)</strong>, Dhaka, or order online for instant delivery across Bangladesh.
          </p>
        </div>
      </div>

      {/* Outlet Highlight Section */}
      <div className="py-16 bg-[#FAF5E7] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold text-[#076136] tracking-widest bg-[#076136]/10 px-3 py-1 rounded-full">
              Physical Store Location
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] dark:text-white mt-2">Our Dhaka Outlet</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Visit us in person for device testing, flavor sampling, expert guidance, and instant purchases.</p>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <span className="bg-[#FDA701] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Official Flagship Outlet
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-white flex items-center gap-2.5 mt-2">
                  <MapPin className="h-6 w-6 text-[#076136]" /> Mr. Mango Kuril Outlet
                </h3>
              </div>
              <a 
                href="https://wa.me/8801700000000?text=Hi! I want to visit Mr. Mango Kuril Outlet." 
                target="_blank" 
                rel="noreferrer"
              >
                <Button className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold h-11 px-6">
                  WhatsApp Store
                </Button>
              </a>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              Conveniently located right beside the AIUB Main Gate in Kuril. Explore our complete collection of 100% authentic disposables, salt nics, premium e-liquids, replacement pods, coils, and accessories. Our experienced staff will help you find the exact puff count and flavor you desire.
            </p>

            <div className="grid md:grid-cols-3 gap-4 text-sm bg-gray-50 dark:bg-[#222] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <strong className="text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <MapPin className="h-4 w-4 text-[#076136]" /> Address:
                </strong>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka.
                </p>
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Clock className="h-4 w-4 text-[#076136]" /> Opening Hours:
                </strong>
                <p className="text-gray-600 dark:text-gray-300">
                  11:00 AM – 11:00 PM (Everyday)
                </p>
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Phone className="h-4 w-4 text-[#076136]" /> Hotline / WhatsApp:
                </strong>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  +880 1700-000000
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="flex-1 sm:flex-initial">
                <Button className="w-full bg-[#1A1A1A] hover:bg-black text-[#FAF5E7] dark:bg-white dark:text-[#1A1A1A] h-11 px-6">
                  Get Directions & Contact
                </Button>
              </Link>
              <Link href="/shop" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-700 h-11 px-6">
                  Shop Online First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Why Choose Mr. Mango in BD?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We've built our reputation on quality, authenticity, and customer trust across Bangladesh.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <ShieldCheck className="h-12 w-12 text-[#FDA701] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">100% Authentic Brands</h3>
              <p className="text-gray-600 text-sm">Directly sourced original products with official scratch verification codes. Zero replicas or fake juices.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <Truck className="h-12 w-12 text-[#FDA701] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Same-Day Dhaka Delivery</h3>
              <p className="text-gray-600 text-sm">Fast same-day delivery inside Dhaka and 2-3 business days courier delivery to all 64 districts in Bangladesh.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <CheckCircle2 className="h-12 w-12 text-[#FDA701] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">bKash & COD Friendly</h3>
              <p className="text-gray-600 text-sm">Pay easily via bKash, Nagad, Rocket, Credit/Debit Card, or Cash on Delivery inside Dhaka.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <Headphones className="h-12 w-12 text-[#FDA701] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Expert Vape Support</h3>
              <p className="text-gray-600 text-sm">Our friendly Dhaka team helps you find the right nicotine strength, pod kit, and flavor profile.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="bg-[#FDA701] py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#1A1A1A]/10">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">50+</div>
              <div className="text-sm font-medium text-[#1A1A1A]/80 uppercase tracking-wider">Top Global Brands</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">1 Flagship</div>
              <div className="text-sm font-medium text-[#1A1A1A]/80 uppercase tracking-wider">Kuril (Beside AIUB)</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">64</div>
              <div className="text-sm font-medium text-[#1A1A1A]/80 uppercase tracking-wider">Districts Delivered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">100%</div>
              <div className="text-sm font-medium text-[#1A1A1A]/80 uppercase tracking-wider">Authentic Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Platform & Engineering Credits */}
      <div className="py-16 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDA701]/15 text-[#FDA701] font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Digital Platform & Engineering
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-white mb-3">
            Engineered by Hameem Bhai
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            The Mr. Mango e-commerce platform, user experience, and digital architecture were engineered with passion and precision by <strong>Hameem Bhai</strong> at <strong>hameembhaierdokan.studio</strong>.
          </p>
          <a
            href="https://hameembhaierdokan.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] dark:bg-white text-[#FAF5E7] dark:text-[#1A1A1A] hover:bg-black font-bold px-6 py-3 rounded-xl text-sm transition-transform hover:-translate-y-0.5 shadow-md"
          >
            Visit hameembhaierdokan.studio →
          </a>
        </div>
      </div>
    </>
  );
}
