import { Link } from 'wouter';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { FadeIn } from '@/components/ui/FadeIn';

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-16 bg-gray-50">
      <FadeIn>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Best-Selling Disposables</h2>
              <p className="text-gray-500 mt-2">Our most popular devices right now.</p>
            </div>
            <Link href="/shop" className="text-[#FDA701] font-bold hover:underline hidden sm:block">
              View All
            </Link>
          </div>
          
          <ProductGrid products={products || []} isLoading={isLoading} />
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="text-[#FDA701] font-bold hover:underline">
              View All Products
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
