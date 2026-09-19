import { useState } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Minus, Plus, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { PaymentMethods } from '@/components/payment/PaymentMethods';

export function Cart() {
  const { items, updateQuantity, removeItem, subtotal, itemCount, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerEmail: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod'>('bkash');

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoMessage(null);

    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim(), subtotal })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedPromo({
          code: data.code,
          discount: data.discount,
          label: data.label
        });
        setPromoMessage({ type: 'success', text: `Coupon applied: ${data.label} (-৳${data.discount.toLocaleString()})` });
        setPromoInput('');
      } else {
        setPromoMessage({ type: 'error', text: data.message || 'Invalid coupon code' });
      }
    } catch (err) {
      setPromoMessage({ type: 'error', text: 'Error applying coupon' });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoMessage(null);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderPayload = {
        email: formData.customerEmail || formData.customerPhone,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          flavor: i.selectedFlavor || i.flavor || '',
          price: i.price,
          quantity: i.quantity
        })),
        subtotal,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'bKash Payment (Make Payment)'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      const orderNumber = data.orderNumber || `MM-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

      // Save order info to session for confirmation page WhatsApp generator
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderNumber,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'bKash Payment (01353219518)',
        items: items.map(i => ({
          name: i.name,
          flavor: i.selectedFlavor || i.flavor,
          quantity: i.quantity,
          price: i.price
        })),
        total: finalTotal
      }));

      clearCart();
      window.location.href = `/order-confirmation?order=${orderNumber}&amount=${finalTotal}&payment=${paymentMethod}`;
    } catch (error) {
      console.error('Order creation error:', error);
      alert('There was an issue processing your order. Please try again or order directly via WhatsApp.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title="Your Cart — Mr.Mango.com" />
        <div className="container mx-auto px-4 py-24 text-center max-w-lg">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet. Browse our top products to find what you're looking for.</p>
          <Link href="/shop">
            <Button className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] h-12 px-8 text-lg w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Your Cart — Mr.Mango.com" />
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">Your Cart ({itemCount})</h1>
          
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <div 
                        className="w-24 h-24 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.colorHex || '#f3f4f6'}20` }}
                      >
                        <img src="/brand/icon.png" alt={item.name} className="w-12 h-12 object-contain opacity-50" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/product/${item.productId}`} className="font-bold text-[#1A1A1A] hover:text-[#FDA701] line-clamp-2">
                          {item.name}
                        </Link>
                        {item.selectedFlavor ? (
                          <span className="inline-block w-fit text-xs font-bold text-[#076136] bg-[#076136]/10 px-2.5 py-0.5 rounded-full mt-1">
                            Flavor: {item.selectedFlavor}
                          </span>
                        ) : item.flavor ? (
                          <p className="text-sm text-gray-500 mt-1">{item.flavor}</p>
                        ) : null}
                        <p className="text-sm font-medium text-[#1A1A1A] mt-2 md:hidden">৳{Math.round(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                      <span className="text-sm text-gray-500 md:hidden">Quantity:</span>
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button 
                          className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                        <button 
                          className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                      <span className="text-sm text-gray-500 md:hidden">Total:</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-[#1A1A1A]">৳{Math.round(item.price * item.quantity).toLocaleString()}</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">৳{Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>-৳{Math.round(discountAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-[#076136] font-medium">Dhaka Same-Day / BD Courier</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Store Pickup</span>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">Kuril (Beside AIUB)</span>
                  </div>
                </div>

                {/* Coupon input */}
                <div className="mb-6 pt-4 border-t border-gray-100">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <Input
                      placeholder="Coupon (e.g. MANGO10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="text-xs uppercase font-semibold border-[#FDA701]/40"
                      disabled={promoLoading || !!appliedPromo}
                    />
                    {appliedPromo ? (
                      <Button type="button" variant="outline" onClick={handleRemovePromo} className="text-red-500 hover:text-red-700 text-xs px-3">
                        Remove
                      </Button>
                    ) : (
                      <Button type="submit" disabled={promoLoading} className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold text-xs px-4">
                        {promoLoading ? '...' : 'Apply'}
                      </Button>
                    )}
                  </form>
                  {promoMessage && (
                    <p className={`text-xs mt-2 font-medium ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </div>
                
                <div className="border-t border-gray-100 pt-6 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#1A1A1A] text-lg">Total Amount</span>
                    <span className="font-bold text-2xl text-[#1A1A1A]">৳{Math.round(finalTotal).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Accepts bKash Payment (01353219518) & Cash on Delivery</p>
                </div>

                {!showCheckout ? (
                  <Button onClick={() => setShowCheckout(true)} className="w-full h-14 text-lg font-bold bg-[#1A1A1A] hover:bg-black text-[#FAF5E7]">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-4 border-t border-gray-100 pt-6 mt-6">
                    <h3 className="font-bold text-lg mb-2">Delivery Details</h3>
                    <Input placeholder="Full Name" name="customerName" required value={formData.customerName} onChange={handleInputChange} />
                    <Input placeholder="Phone (WhatsApp)" name="customerPhone" required value={formData.customerPhone} onChange={handleInputChange} />
                    <Input placeholder="Delivery Address (Dhaka or nationwide)" name="customerAddress" required value={formData.customerAddress} onChange={handleInputChange} />
                    <Input placeholder="Email (Optional)" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} />
                    
                    <h3 className="font-bold text-lg mt-6 mb-2">Payment Method</h3>
                    
                    <div className="space-y-3">
                      <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]/5 shadow-sm' : 'border-gray-200 hover:border-[#e2136e]/40'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]' : 'border-gray-300'}`}>
                            {paymentMethod === 'bkash' && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#e2136e]"></span>
                                bKash Payment (Make Payment)
                              </span>
                              <span className="text-[11px] bg-[#e2136e] text-white font-bold px-2 py-0.5 rounded-md">
                                01353219518
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Pay via bKash App &gt; <strong>Make Payment</strong> option to <strong>01353219518</strong> (Not Send Money). Submit TrxID upon checkout.
                            </p>
                          </div>
                        </div>
                        <input type="radio" name="paymentMethod" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="hidden" />
                      </label>

                      <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#FDA701] bg-[#FDA701]/5 shadow-sm' : 'border-gray-200 hover:border-[#FDA701]/40'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${paymentMethod === 'cod' ? 'border-[#FDA701] bg-[#FDA701]' : 'border-gray-300'}`}>
                            {paymentMethod === 'cod' && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#1A1A1A] block">Cash on Delivery (COD)</span>
                            <span className="text-xs text-gray-500">Pay cash upon delivery. Same-day inside Dhaka (৳60), 2-3 days nationwide (৳120).</span>
                          </div>
                        </div>
                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                      </label>
                    </div>
                    
                    <Button type="submit" disabled={isProcessing} className="w-full h-14 text-lg font-bold bg-[#1A1A1A] hover:bg-black text-[#FAF5E7] mt-4">
                      {isProcessing ? 'Processing...' : 'Place Order'} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                )}
                
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
