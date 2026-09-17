import { useComparison } from '@/hooks/useComparison';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useComparison();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {compareList.map((product) => (
                <div key={product.slug} className="relative flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 min-w-[150px]">
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-contain bg-white rounded" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold truncate max-w-[100px]">{product.name}</span>
                    <span className="text-[10px] text-gray-500">৳{Math.round(product.price).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => removeFromCompare(product.slug)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {compareList.length < 3 && (
                <div className="text-sm text-gray-400 hidden sm:block italic">
                  Add up to {3 - compareList.length} more
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <Button variant="outline" size="sm" onClick={clearCompare} className="flex-1 sm:flex-none text-gray-500">
                Clear
              </Button>
              <Link href="/compare" className="flex-1 sm:flex-none">
                <Button size="sm" className="w-full bg-[#FDA701] text-[#1A1A1A] hover:bg-[#e59600]">
                  Compare ({compareList.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
