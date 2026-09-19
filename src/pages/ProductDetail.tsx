import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useComparison } from '@/hooks/useComparison';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, AlertCircle, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug || '');
  const { addItem } = useCart();
  const { addProduct } = useRecentlyViewed();
  const { addToCompare, removeFromCompare, isInCompare } = useComparison();
  const [quantity, setQuantity] = useState(1);
  
  const [isSticky, setIsSticky] = useState(false);
  const addToCartRef = useRef<HTMLDivElement>(null);

  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');

  const availableFlavors = (product?.flavors
    ? (Array.isArray(product.flavors) ? product.flavors : product.flavors.split(',').map(s => s.trim()).filter(Boolean))
    : []) as string[];

  useEffect(() => {
    if (availableFlavors.length > 0 && !selectedFlavor) {
      setSelectedFlavor(availableFlavors[0]);
    }
  }, [availableFlavors, selectedFlavor]);

  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product?.slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }
    return () => observer.disconnect();
  }, [product, isLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl w-full" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop">
          <Button className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A]">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedFlavor || undefined);
  };

  const isComparing = isInCompare(product.slug);
  const handleCompareClick = () => {
    if (isComparing) {
      removeFromCompare(product.slug);
    } else {
      addToCompare(product);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name + (selectedFlavor ? ` (${selectedFlavor})` : ''),
          customerName: waitlistName,
          customerPhone: waitlistPhone
        })
      });
      setWaitlistSubmitted(true);
    } catch (err) {
      console.error('Waitlist submit error:', err);
      setWaitlistSubmitted(true);
    }
  };

  return (
    <>
      <SEO 
        title={`${product.name} — Mr.Mango.com`} 
        description={product.description || (product as any).flavor}
        product={product} 
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#FDA701]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#FDA701]">Shop</Link>
          {(product.category || product.categoryId) && (
            <>
              <span>/</span>
              <Link href={`/shop/${product.category || product.categoryId}`} className="hover:text-[#FDA701] capitalize">
                {(product.category || product.categoryId)?.replace('-', ' ')}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div 
            className="aspect-square rounded-3xl p-12 flex items-center justify-center relative"
            style={{ backgroundColor: `${(product as any).colorHex || '#f3f4f6'}15` }}
          >
            <img 
              src={product.imageUrl || '/brand/icon.png'} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply" 
              onError={(e) => { (e.target as HTMLImageElement).src = '/brand/icon.png'; }}
            />
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-2">{product.name}</h1>
              <button 
                onClick={handleCompareClick}
                className="bg-white border border-gray-200 text-gray-500 hover:text-[#076136] p-2 rounded-full shadow-sm hover:shadow transition-all shrink-0"
                aria-label="Compare"
              >
                <BarChart2 size={20} className={isComparing ? 'text-[#076136] fill-[#076136]/20' : ''} />
              </button>
            </div>
            
            <h2 className="text-xl text-gray-500 mb-6">{(product as any).flavor || product.flavor_profile}</h2>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-bold text-[#1A1A1A]">৳{Math.round(product.price).toLocaleString()}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">৳{Math.round(product.compareAtPrice).toLocaleString()}</span>
              )}
            </div>
            
            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span> In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span> Sold Out
                </span>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <h3 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Specifications</h3>
              <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200 text-center">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Puff Count</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.puffCount || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Nicotine</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.nicotine_strength || '5%'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">E-Liquid</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.volume || '10ml'}</span>
                </div>
              </div>
            </div>

            {/* Flavor Variant Selector */}
            {availableFlavors.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Available Flavors ({availableFlavors.length})
                  </span>
                  {selectedFlavor && (
                    <span className="text-xs font-bold text-[#FDA701] bg-[#FDA701]/10 px-2.5 py-0.5 rounded-full">
                      {selectedFlavor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableFlavors.map((flavor) => {
                    const isSelected = selectedFlavor === flavor;
                    return (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#FDA701] text-[#1A1A1A] shadow-sm scale-[1.02]'
                            : 'bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#FDA701]'
                        }`}
                      >
                        {flavor}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={addToCartRef} className="flex flex-col gap-4 mb-8 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
              {product.inStock ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg h-14 w-32 shrink-0 bg-white dark:bg-[#1f1f1f]">
                    <button 
                      className="flex-1 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-medium w-8 text-center">{quantity}</span>
                    <button 
                      className="flex-1 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <Button 
                    className="flex-1 h-14 text-lg font-bold bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A]"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart {selectedFlavor ? `(${selectedFlavor})` : ''}
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  {!showWaitlist ? (
                    <Button 
                      className="w-full h-14 text-lg font-bold bg-[#076136] hover:bg-[#054d2b] text-white"
                      onClick={() => setShowWaitlist(true)}
                    >
                      Notify Me When Available
                    </Button>
                  ) : (
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                      {waitlistSubmitted ? (
                        <div className="text-center py-4 text-[#076136] font-bold">
                          ✅ We'll WhatsApp you when it's back in stock!
                        </div>
                      ) : (
                        <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3">
                          <input 
                            type="text" 
                            placeholder="Your Name" 
                            required
                            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] focus:outline-none focus:border-[#076136]"
                            value={waitlistName}
                            onChange={(e) => setWaitlistName(e.target.value)}
                          />
                          <input 
                            type="tel" 
                            placeholder="WhatsApp Number" 
                            required
                            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] focus:outline-none focus:border-[#076136]"
                            value={waitlistPhone}
                            onChange={(e) => setWaitlistPhone(e.target.value)}
                          />
                          <Button type="submit" className="bg-[#076136] hover:bg-[#054d2b] text-white">
                            Notify Me
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <a 
                href={`https://wa.me/8801880031355?text=Hi! I want to order: ${encodeURIComponent(product.name)}${selectedFlavor ? ` (Flavor: ${encodeURIComponent(selectedFlavor)})` : ''}`} 
                target="_blank" 
                rel="noreferrer"
              >
                <Button variant="outline" className="w-full h-14 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order via WhatsApp
                </Button>
              </a>
            </div>
            
            <div className="border border-[#1A1A1A] rounded-lg p-4 flex gap-3 bg-white">
              <AlertCircle className="h-6 w-6 text-[#1A1A1A] shrink-0" />
              <p className="text-sm font-bold uppercase text-[#1A1A1A]">
                WARNING: This product contains nicotine. Nicotine is an addictive chemical.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto border-t border-gray-200 pt-12 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Description</h2>
          <div className="prose prose-lg text-gray-600">
            <p>{product.description || `Experience the premium quality of ${product.name}. With carefully crafted flavors and reliable performance, this device delivers satisfaction in every puff.`}</p>
          </div>
        </div>
      </div>
      
      <RecentlyViewed />

      <AnimatePresence>
        {isSticky && product.inStock && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/95 dark:bg-[#141414]/95 border-t border-gray-200/80 dark:border-gray-800 shadow-[0_-10px_25px_rgba(0,0,0,0.1)] py-2.5 sm:py-3"
          >
            <div className="container mx-auto px-4 flex items-center justify-between gap-3 sm:gap-4 max-w-5xl">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img 
                  src={product.imageUrl || '/brand/icon.png'} 
                  alt="" 
                  className="w-10 h-10 object-contain rounded-lg shrink-0 hidden xs:block" 
                  onError={(e) => { (e.target as HTMLImageElement).src = '/brand/icon.png'; }}
                />
                <div className="flex flex-col overflow-hidden leading-tight">
                  <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white truncate">{product.name}</span>
                  <span className="text-[#FDA701] font-bold text-sm sm:text-base">৳{Math.round(product.price).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222] rounded-xl h-9 sm:h-10 w-20 sm:w-24">
                  <button 
                    className="flex-1 text-gray-500 hover:text-black dark:hover:text-white font-bold text-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="font-bold w-5 sm:w-6 text-center text-xs sm:text-sm text-[#1A1A1A] dark:text-white">{quantity}</span>
                  <button 
                    className="flex-1 text-gray-500 hover:text-black dark:hover:text-white font-bold text-sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <Button 
                  className="bg-[#FDA701] hover:bg-[#e59600] active:scale-95 text-[#1A1A1A] font-bold h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm rounded-xl shadow-sm"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
