import { Link } from 'wouter';
import { ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartSheet() {
  const { items, isOpen, toggleCart, subtotal, itemCount } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open && isOpen) toggleCart();
      if (open && !isOpen) toggleCart();
    }}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white p-0">
        <SheetHeader className="p-6 border-b border-gray-100">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            Your Cart <span className="bg-[#FDA701] text-white text-xs px-2 py-0.5 rounded-full">{itemCount}</span>
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] w-full max-w-[200px]" onClick={toggleCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow px-6">
              <div className="py-2">
                {items.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4 text-[#1A1A1A]">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="font-bold text-xl">৳{Math.round(subtotal).toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 text-center">Fast delivery across Dhaka & nationwide BD.</p>
              
              <Link href="/cart">
                <Button className="w-full bg-[#1A1A1A] hover:bg-black text-[#FAF5E7] py-6 text-lg" onClick={toggleCart}>
                  View Cart & Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
