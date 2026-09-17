import { Link } from 'wouter';
import { Plus, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useComparison } from '@/hooks/useComparison';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useComparison();

  const isComparing = isInCompare(product.slug);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(product.slug);
    } else {
      addToCompare(product);
    }
  };

  const isNewArrival = product.featured && !product.compareAtPrice;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group relative rounded-2xl bg-white dark:bg-[#1a1a1a] border border-transparent dark:border-gray-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {!product.inStock && (
            <div className="bg-[#1A1A1A] text-white text-xs font-bold px-2 py-1 rounded">
              Sold Out
            </div>
          )}
          {product.compareAtPrice && product.inStock && (
            <div className="bg-[#FDA701] text-white text-xs font-bold px-2 py-1 rounded">
              Sale
            </div>
          )}
          {isNewArrival && (
            <div className="bg-[#076136] text-white text-xs font-bold px-2 py-1 rounded">
              🆕 NEW
            </div>
          )}
        </div>

        <button 
          onClick={handleCompareClick}
          className="absolute top-3 right-3 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-500 dark:text-gray-300 hover:text-[#076136] p-1.5 rounded-full shadow-sm hover:shadow transition-all"
          aria-label="Compare"
        >
          <BarChart2 size={16} className={isComparing ? 'text-[#076136] fill-[#076136]/20' : ''} />
        </button>
        
        <div 
          className="aspect-[3/4] relative p-6 flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${(product as any).colorHex || '#f3f4f6'}14` }}
        >
          <img 
            src={product.imageUrl || '/brand/icon.png'} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = '/brand/icon.png'; }}
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-[#1A1A1A] line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{(product as any).flavor || product.flavor_profile}</p>
          
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.compareAtPrice && (
                  <span className="text-xs text-gray-400 line-through">৳{Math.round(product.compareAtPrice).toLocaleString()}</span>
                )}
                <span className="font-bold text-lg text-[#1A1A1A]">৳{Math.round(product.price).toLocaleString()}</span>
              </div>
              
              <Button 
                size="icon" 
                className={cn(
                  "rounded-full h-10 w-10 transition-transform hover:scale-110", 
                  !product.inStock ? "bg-gray-200 text-gray-400" : "bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A]"
                )}
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
