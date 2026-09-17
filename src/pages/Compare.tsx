import { Link } from 'wouter';
import { useComparison } from '@/hooks/useComparison';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import { SEO } from '@/components/SEO';

export function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useComparison();
  const { addItem } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <SEO title="Compare Products — Mr.Mango.com" />
        <h1 className="text-3xl font-bold mb-4 text-[#1A1A1A]">Compare Products</h1>
        <p className="text-gray-500 mb-8">You haven't selected any products to compare yet.</p>
        <Link href="/shop">
          <Button className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold">
            Go to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="Compare Products — Mr.Mango.com" />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Compare Products</h1>
        <Button variant="outline" onClick={clearCompare}>
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-[700px] border-collapse bg-white rounded-2xl shadow-sm overflow-hidden">
          <thead>
            <tr>
              <th className="p-6 text-left border-b border-gray-100 bg-gray-50 w-48 font-bold text-gray-500 uppercase tracking-wider text-sm">
                Features
              </th>
              {compareList.map((product) => (
                <th key={product.slug} className="p-6 text-center border-b border-l border-gray-100 relative w-1/3">
                  <button 
                    onClick={() => removeFromCompare(product.slug)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 flex items-center justify-center p-4 rounded-xl bg-gray-50">
                      <img src="/brand/icon.png" alt={product.name} className="w-full h-full object-contain opacity-50" />
                    </div>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-bold text-[#1A1A1A] text-lg hover:text-[#076136] cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                </th>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                <th key={`empty-${i}`} className="p-6 text-center border-b border-l border-gray-100 w-1/3">
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <span className="text-sm">Add Product</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Price</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100">
                  <div className="flex flex-col items-center">
                    {product.compareAtPrice && (
                      <span className="text-xs text-gray-400 line-through">৳{Math.round(product.compareAtPrice).toLocaleString()}</span>
                    )}
                    <span className="font-bold text-lg text-[#FDA701]">৳{Math.round(product.price).toLocaleString()}</span>
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-p-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Category</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100 capitalize">
                  {product.categoryId}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-c-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Flavor</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100">
                  {(product as any).flavor || product.flavor_profile || '-'}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-f-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Puff Count</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100 font-medium">
                  {product.puffCount || '-'}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-pc-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Nicotine</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100">
                  {product.nicotine_strength || '5%'}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-n-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Volume</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100">
                  {product.volume || '-'}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-v-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>

            <tr>
              <td className="p-4 bg-gray-50 font-medium text-gray-700 border-r border-gray-100">Stock Status</td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-4 text-center border-l border-gray-100">
                  {product.inStock ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Sold Out</span>
                  )}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-s-${i}`} className="p-4 border-l border-gray-100 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-6 bg-gray-50 border-r border-gray-100 rounded-bl-2xl"></td>
              {compareList.map((product) => (
                <td key={product.slug} className="p-6 text-center border-l border-gray-100">
                  <Button 
                    className="w-full bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold"
                    disabled={!product.inStock}
                    onClick={() => addItem({ ...product, quantity: 1 })}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-btn-${i}`} className={`p-6 border-l border-gray-100 bg-gray-50/50 ${i === 2 - compareList.length ? 'rounded-br-2xl' : ''}`}></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
