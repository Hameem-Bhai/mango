import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  flavor?: string;
  price: number;
  quantity: number;
  colorHex?: string;
}

export function CartItem({ id, name, flavor, price, quantity, colorHex }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div 
        className="w-20 h-24 rounded-lg flex items-center justify-center bg-opacity-10 shrink-0"
        style={{ backgroundColor: `${colorHex || '#f3f4f6'}20` }}
      >
        <img src="/brand/icon.png" alt={name} className="w-12 h-12 object-contain opacity-50" />
      </div>
      
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-bold text-sm text-[#1A1A1A] line-clamp-2">{name}</h4>
            {flavor && <p className="text-xs text-gray-500 mt-1">{flavor}</p>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-red-500 shrink-0"
            onClick={() => removeItem(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-md">
            <button 
              className="px-2 py-1 text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
              onClick={() => updateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-sm font-medium w-8 text-center">{quantity}</span>
            <button 
              className="px-2 py-1 text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
              onClick={() => updateQuantity(id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="font-bold text-sm text-[#1A1A1A]">৳{Math.round(price * quantity).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
