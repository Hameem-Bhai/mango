import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'disposables', name: 'Disposables' },
  { id: 'e-liquids', name: 'E-Liquids' },
  { id: 'coils-tanks', name: 'Coils & Cartridges' },
  { id: 'pod-kits', name: 'Pod Kits' }
];

export function Shop() {
  const { category: rawCategory = 'all' } = useParams();
  const [sort, setSort] = useState('featured');

  // Support legacy / accessories alias
  const category = rawCategory === 'accessories' ? 'coils-tanks' : rawCategory;

  const urlSearch = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || undefined;
  }, []);

  const [search, setSearch] = useState<string | undefined>(urlSearch);

  const { data: products, isLoading } = useProducts({
    category: category !== 'all' ? category : undefined,
    search: search || undefined,
    sort
  });

  const currentCategory = categories.find(c => c.id === category) || categories[0];

  return (
    <>
      <SEO title={`${search ? `Search: "${search}"` : currentCategory.name} — Shop Mr.Mango.com`} />
      
      <div className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#FDA701]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#FDA701]">Shop</Link>
            {category !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#1A1A1A] dark:text-white font-medium">{currentCategory.name}</span>
              </>
            )}
            {search && (
              <>
                <span>/</span>
                <span className="text-[#FDA701] font-medium">"{search}"</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-white">
                {search ? `Search Results for "${search}"` : currentCategory.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {products?.length ?? 0} authentic vape products available in Bangladesh
              </p>
            </div>
            {search && (
              <button
                onClick={() => {
                  setSearch(undefined);
                  window.history.replaceState({}, '', category === 'all' ? '/shop' : `/shop/${category}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#FDA701] hover:text-black w-fit transition-colors"
              >
                Clear Search: "{search}" <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = (category === c.id || (category === undefined && c.id === 'all'));
              return (
                <Link key={c.id} href={c.id === 'all' ? '/shop' : `/shop/${c.id}`}>
                  <span className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all border block",
                    isActive
                      ? "bg-[#FDA701] text-black border-[#FDA701] shadow-sm font-bold"
                      : "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-[#FDA701] hover:text-[#FDA701]"
                  )}>
                    {c.name}
                  </span>
                </Link>
              );
            })}
          </div>
          
          <div className="w-full md:w-52 shrink-0">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full bg-white dark:bg-[#1a1a1a] dark:text-white dark:border-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1a1a1a] dark:text-white dark:border-gray-800">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProductGrid products={products || []} isLoading={isLoading} />
      </div>
    </>
  );
}

