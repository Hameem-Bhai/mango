import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ProductCard } from './ProductCard';

export function RecentlyViewed() {
  const { products } = useRecentlyViewed();

  if (products.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Recently Viewed</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x">
          {products.map((product) => (
            <div key={product.slug} className="min-w-[280px] sm:min-w-[300px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
