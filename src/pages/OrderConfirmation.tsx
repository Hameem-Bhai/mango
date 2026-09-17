import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Copy } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';

export function OrderConfirmation() {
  const { clearCart } = useCart();
  const [orderInfo, setOrderInfo] = useState<{
    orderNumber: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    paymentMethod?: string;
    items?: Array<{ name: string; flavor?: string; quantity: number; price: number }>;
    total?: number;
  }>({
    orderNumber: ''
  });
  
  useEffect(() => {
    clearCart();
    const params = new URLSearchParams(window.location.search);
    const orderParam = params.get('order');
    const amountParam = params.get('amount');
    const paymentParam = params.get('payment');

    const saved = sessionStorage.getItem('lastOrder');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrderInfo(parsed);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    setOrderInfo({
      orderNumber: orderParam || `MM-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      total: amountParam ? Number(amountParam) : undefined,
      paymentMethod: paymentParam === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (bKash/Nagad)'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyNumber = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateWhatsAppMessage = () => {
    let msg = `🛒 *New Order from Mr.Mango.com!*\n`;
    msg += `*Order ID:* ${orderInfo.orderNumber}\n`;
    if (orderInfo.customerName) msg += `*Customer:* ${orderInfo.customerName}\n`;
    if (orderInfo.customerPhone) msg += `*Phone:* ${orderInfo.customerPhone}\n`;
    if (orderInfo.customerAddress) msg += `*Delivery Address:* ${orderInfo.customerAddress}\n`;
    if (orderInfo.paymentMethod) msg += `*Payment:* ${orderInfo.paymentMethod}\n`;

    if (orderInfo.items && orderInfo.items.length > 0) {
      msg += `\n*Items Ordered:*\n`;
      orderInfo.items.forEach(item => {
        msg += `• ${item.quantity}x ${item.name}${item.flavor ? ` (${item.flavor})` : ''} - ৳${(item.price * item.quantity).toLocaleString()}\n`;
      });
    }

    if (orderInfo.total) {
      msg += `\n*Total Amount:* ৳${orderInfo.total.toLocaleString()}\n`;
    }
    msg += `\nPlease confirm and prepare my order. Thank you!`;
    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/8801700000000?text=${generateWhatsAppMessage()}`;

  return (
    <>
      <SEO title="Order Confirmed — Mr.Mango.com" />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="inline-block"
          >
            <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] dark:text-white mb-4">Order Received!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Thank you for your purchase from Mr. Mango.</p>
          <p className="text-lg text-gray-800 dark:text-gray-200">Your order number is: <span className="font-bold text-[#1A1A1A] dark:text-black bg-[#FDA701] px-3 py-1 rounded-lg ml-2">{orderInfo.orderNumber}</span></p>
        </div>

        {/* WhatsApp Quick Notification Banner */}
        <div className="bg-[#25D366]/10 border-2 border-[#25D366] rounded-3xl p-6 sm:p-8 mb-8 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Fast-Track Your Order via WhatsApp</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-5">
            Send your order details directly to our Kuril outlet team (Tong Market, beside AIUB) for instant confirmation and delivery dispatch.
          </p>
          <div className="flex justify-center">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold h-12 px-8 shadow-md">
                Notify Kuril Outlet via WhatsApp (+880 1700-000000)
              </Button>
            </a>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 dark:bg-green-950/20 rounded-bl-full pointer-events-none -z-10 opacity-50"></div>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">Payment Instructions</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">If you selected bKash or Nagad, send money using your order number as reference:</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* bKash */}
            <div className="bg-white border-2 border-[#e2136e] rounded-2xl overflow-hidden shadow-sm relative group">
              <div className="bg-[#e2136e] text-white p-4 flex justify-between items-center">
                <span className="font-bold text-lg">bKash</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Personal</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Send Money to</p>
                    <p className="text-2xl font-bold text-[#e2136e] tracking-wider">01700-000000</p>
                  </div>
                  <button onClick={() => copyNumber('01700000000')} className="text-gray-400 hover:text-[#e2136e] p-2 bg-gray-50 rounded-full">
                    <Copy size={20} />
                  </button>
                </div>
                <div className="bg-[#e2136e]/5 p-3 rounded-xl">
                  <p className="text-sm font-medium text-[#e2136e] mb-1">Instructions:</p>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Go to bKash Menu</li>
                    <li>Select Send Money</li>
                    <li>Enter the number above</li>
                    <li>Use <strong className="text-[#1A1A1A]">{orderInfo.orderNumber}</strong> as reference</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Nagad */}
            <div className="bg-white border-2 border-[#f26522] rounded-2xl overflow-hidden shadow-sm relative group">
              <div className="bg-[#f26522] text-white p-4 flex justify-between items-center">
                <span className="font-bold text-lg">Nagad</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Personal</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Send Money to</p>
                    <p className="text-2xl font-bold text-[#f26522] tracking-wider">01700-000000</p>
                  </div>
                  <button onClick={() => copyNumber('01700000000')} className="text-gray-400 hover:text-[#f26522] p-2 bg-gray-50 rounded-full">
                    <Copy size={20} />
                  </button>
                </div>
                <div className="bg-[#f26522]/5 p-3 rounded-xl">
                  <p className="text-sm font-medium text-[#f26522] mb-1">Instructions:</p>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Go to Nagad App</li>
                    <li>Select Send Money</li>
                    <li>Enter the number above</li>
                    <li>Use <strong className="text-[#1A1A1A]">{orderInfo.orderNumber}</strong> as reference</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FDA701]/10 border border-[#FDA701]/30 p-4 rounded-xl text-center">
            <p className="font-bold text-[#1A1A1A]">Reference Instruction</p>
            <p className="text-gray-700">You <strong className="text-red-500 uppercase">must</strong> use your order number <strong className="bg-white px-2 py-1 rounded shadow-sm border border-gray-200 mx-1">{orderInfo.orderNumber}</strong> as the reference.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={orderInfo.orderNumber ? `/track-order?order=${encodeURIComponent(orderInfo.orderNumber)}` : '/track-order'} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-bold">
              Track My Order <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] h-14 px-8 text-lg font-bold">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
