import { SEO } from '@/components/SEO';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Outlets } from '@/components/home/Outlets';
import { InstagramFeed } from '@/components/home/InstagramFeed';

export function Home() {
  return (
    <>
      <SEO title="Mr.Mango.com — Your Favorite Vape Shop in BD" description="Mr.Mango.com — 100% authentic disposables, pod kits, e-liquids, and accessories in Bangladesh. Physical outlet in Kuril, Dhaka (Beside AIUB Main Gate)." />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <Outlets />
      <InstagramFeed />
      
      <div className="bg-[#1A1A1A] py-6 border-b-4 border-[#FDA701]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white font-bold uppercase tracking-wider text-sm sm:text-base">
            WARNING: This product contains nicotine. Nicotine is an addictive chemical.
          </p>
        </div>
      </div>
    </>
  );
}
