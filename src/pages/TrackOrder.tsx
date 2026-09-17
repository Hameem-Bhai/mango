import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, AlertCircle, Clock, MessageSquare, ShoppingBag, XCircle } from 'lucide-react';

export function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-track if ?order= is in query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderParam = params.get('order');
    if (orderParam) {
      setOrderNumber(orderParam);
      fetchOrder(orderParam);
    }
  }, []);

  const fetchOrder = async (ordNum: string) => {
    const trimmed = ordNum.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trimmed)}/track`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
        setStatus('found');
      } else {
        setStatus('not_found');
        setErrorMsg('No order found with this order number. Please verify the ID from your confirmation or receipt.');
      }
    } catch (err) {
      console.error(err);
      setStatus('not_found');
      setErrorMsg('Could not fetch tracking details. Please check your internet connection or contact us via WhatsApp.');
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  // Helper to determine stage
  const currentStatus = (orderData?.status || 'placed').toLowerCase();
  const isCancelled = currentStatus === 'cancelled';

  const stages = [
    { key: 'placed', label: 'Order Placed', desc: 'Order received and recorded in our system.' },
    { key: 'processing', label: 'Processing & Packed', desc: 'Items verified and packaged at the outlet.' },
    { key: 'shipped', label: 'Out for Delivery / Shipped', desc: 'Dispatched with Dhaka rider or nationwide courier.' },
    { key: 'delivered', label: 'Delivered', desc: 'Successfully handed over to customer.' },
  ];

  const getStageIndex = (st: string) => {
    if (st === 'delivered') return 3;
    if (st === 'shipped') return 2;
    if (st === 'processing' || st === 'confirmed') return 1;
    return 0; // placed
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <>
      <SEO 
        title="Track BD Order — Mr.Mango.com" 
        description="Track your Mr. Mango vape order live in Bangladesh. Check real-time delivery status for Dhaka and nationwide courier shipments."
      />
      
      <div className="bg-gray-50 dark:bg-[#121212] min-h-screen py-16 transition-colors">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FDA701] bg-[#FDA701]/10 px-3.5 py-1 rounded-full">
              Live Order Tracker
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-white mt-3 mb-3">Track Your Order</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Enter your Mr. Mango order number (e.g. <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">MM-2026-XXXXX</code>) to view live status.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white dark:bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
            <form onSubmit={handleTrack} className="flex gap-3 flex-col sm:flex-row">
              <Input 
                placeholder="Enter Order Number (e.g. MM-2026-12345)" 
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="h-12 flex-1 bg-gray-50 dark:bg-[#222] dark:border-gray-700 text-base"
                required
              />
              <Button 
                type="submit" 
                className="h-12 px-8 bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold shrink-0" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Tracking...' : 'Track Order'}
              </Button>
            </form>
          </div>

          {/* Error / Not Found State */}
          {status === 'not_found' && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center text-red-700 dark:text-red-400 mb-8">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-bold mb-1">Order Not Found</p>
              <p className="text-sm mb-4">{errorMsg}</p>
              <a 
                href={`https://wa.me/8801700000000?text=Hi Mr. Mango, I am having trouble tracking my order: ${encodeURIComponent(orderNumber)}`} 
                target="_blank" 
                rel="noreferrer"
              >
                <Button variant="outline" size="sm" className="border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40">
                  <MessageSquare className="w-4 h-4 mr-2" /> Help via WhatsApp
                </Button>
              </a>
            </div>
          )}

          {/* Found Order Card */}
          {status === 'found' && orderData && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-8">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Order Reference</span>
                  <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mt-0.5">{orderData.orderNumber}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Placed: {orderData.createdAt ? new Date(orderData.createdAt).toLocaleString() : 'Recent'}
                  </p>
                </div>
                <div>
                  {isCancelled ? (
                    <span className="bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Cancelled
                    </span>
                  ) : (
                    <span className="bg-[#FDA701]/15 text-[#b27200] dark:text-[#FDA701] border border-[#FDA701]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {currentStatus.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              {!isCancelled ? (
                <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-gray-200 dark:border-gray-800 ml-4 my-6">
                  {stages.map((stage, idx) => {
                    const isPassed = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div key={stage.key} className="relative">
                        {/* Status Icon Indicator */}
                        <div 
                          className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-[#1a1a1a] shadow-sm transition-all ${
                            isPassed 
                              ? isCurrent 
                                ? 'bg-[#FDA701] ring-4 ring-[#FDA701]/20 scale-110' 
                                : 'bg-green-500' 
                              : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5 text-gray-500" />}
                        </div>

                        <div>
                          <h3 className={`font-bold text-base ${isPassed ? 'text-[#1A1A1A] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                            {stage.label}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] bg-[#FDA701] text-black font-extrabold uppercase px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400">
                  This order was marked as cancelled. If this was a mistake, please reach out to our staff immediately.
                </div>
              )}

              {/* Items & Delivery Details Summary */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                <div>
                  <h4 className="font-bold text-[#1A1A1A] dark:text-white mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#FDA701]" /> Ordered Items
                  </h4>
                  {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
                    <div className="space-y-1.5 bg-gray-50 dark:bg-[#222] p-3 rounded-xl">
                      {orderData.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                          <span>{item.quantity}x {item.name}{item.flavor ? ` (${item.flavor})` : ''}</span>
                          <span className="font-bold">৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Cart details recorded on file</p>
                  )}
                  <div className="flex justify-between mt-3 text-sm font-bold text-[#1A1A1A] dark:text-white">
                    <span>Total Amount:</span>
                    <span className="text-[#076136] dark:text-[#A8D86E]">৳{Number(orderData.total || orderData.subtotal || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#1A1A1A] dark:text-white mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#076136]" /> Delivery Destination
                  </h4>
                  <div className="bg-gray-50 dark:bg-[#222] p-3 rounded-xl text-xs space-y-1 text-gray-700 dark:text-gray-300">
                    <p><strong>Customer:</strong> {orderData.customerName || 'Valued Customer'}</p>
                    {orderData.customerPhone && <p><strong>Phone:</strong> {orderData.customerPhone}</p>}
                    {orderData.customerAddress && <p><strong>Address:</strong> {orderData.customerAddress}</p>}
                    <p><strong>Payment:</strong> {orderData.paymentMethod || 'Cash on Delivery'}</p>
                  </div>
                </div>
              </div>

              {/* Need assistance button */}
              <div className="pt-2 text-center">
                <a 
                  href={`https://wa.me/8801700000000?text=Hi Mr. Mango, inquiring about my order: ${orderData.orderNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" className="gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                    <MessageSquare className="w-4 h-4" /> Message Support About This Order
                  </Button>
                </a>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
