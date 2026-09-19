import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, ChevronRight, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';

export function OrderConfirmation() {
  const { clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // TrxID submission state
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);
  const [trxSubmitted, setTrxSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
        if (parsed.customerPhone) {
          setSenderPhone(parsed.customerPhone);
        }
        return;
      } catch (e) {
        console.error(e);
      }
    }

    setOrderInfo({
      orderNumber: orderParam || `MM-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      total: amountParam ? Number(amountParam) : undefined,
      paymentMethod: paymentParam === 'cod' ? 'Cash on Delivery (COD)' : 'bKash Payment (01353219518)'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOrderNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const handleTrxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      setSubmitError('Please enter your bKash Transaction ID (TrxID)');
      return;
    }

    setIsSubmittingTrx(true);
    setSubmitError('');

    try {
      const res = await fetch(`/api/orders/${orderInfo.orderNumber}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trxId: trxId.trim().toUpperCase(),
          senderPhone: senderPhone.trim(),
          paymentStatus: 'submitted'
        })
      });

      if (res.ok) {
        setTrxSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSubmitError(errData.error || 'Failed to submit TrxID. Please send it directly via WhatsApp.');
      }
    } catch (err) {
      setSubmitError('Network issue. Please send your TrxID via WhatsApp.');
    } finally {
      setIsSubmittingTrx(false);
    }
  };

  const generateWhatsAppMessage = () => {
    let msg = `🛒 *New Order from Mr.Mango.com!*\n`;
    msg += `*Order ID:* ${orderInfo.orderNumber}\n`;
    if (orderInfo.customerName) msg += `*Customer:* ${orderInfo.customerName}\n`;
    if (orderInfo.customerPhone) msg += `*Phone:* ${orderInfo.customerPhone}\n`;
    if (orderInfo.customerAddress) msg += `*Delivery Address:* ${orderInfo.customerAddress}\n`;
    if (orderInfo.paymentMethod) msg += `*Payment:* ${orderInfo.paymentMethod}\n`;
    if (trxId) msg += `*bKash TrxID:* ${trxId.toUpperCase()}\n`;
    if (senderPhone) msg += `*bKash Sender Phone:* ${senderPhone}\n`;

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

  const whatsappUrl = `https://wa.me/8801880031355?text=${generateWhatsAppMessage()}`;
  const isCod = orderInfo.paymentMethod?.toLowerCase().includes('cash on delivery') || orderInfo.paymentMethod?.toLowerCase().includes('cod');

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
          <p className="text-gray-600 dark:text-gray-300 mb-2">Thank you for your purchase from Mr. Mango BD.</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-sm text-gray-500">Order Number:</span>
            <span className="font-mono font-bold text-lg bg-[#FDA701] text-[#1A1A1A] px-3.5 py-1 rounded-lg">
              {orderInfo.orderNumber}
            </span>
            <button 
              onClick={() => copyOrderNumber(orderInfo.orderNumber)} 
              title="Copy Order ID"
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              {copiedOrder ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {orderInfo.total && (
            <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-2">
              Total Payable: ৳{orderInfo.total.toLocaleString()}
            </p>
          )}
        </div>

        {/* WhatsApp Fast-Track Notification Banner */}
        <div className="bg-[#25D366]/10 border-2 border-[#25D366] rounded-3xl p-6 sm:p-8 mb-8 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Fast-Track Your Order via WhatsApp</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-5">
            Send your order details directly to our Kuril outlet team (Tong Market, beside AIUB) on <strong>+880 1880-031355</strong> for instant confirmation and speedy dispatch.
          </p>
          <div className="flex justify-center">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold h-12 px-8 shadow-md">
                Notify Kuril Outlet via WhatsApp (+880 1880-031355)
              </Button>
            </a>
          </div>
        </div>
        
        {/* Payment Section */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 dark:bg-pink-950/10 rounded-bl-full pointer-events-none -z-10 opacity-60"></div>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            Payment & Verification
          </h2>

          {isCod ? (
            <div className="py-4 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5">
                <h3 className="font-bold text-base text-amber-900 dark:text-amber-300 mb-1">Cash on Delivery Selected</h3>
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  Please keep exact cash ready upon delivery. Our rider will contact your phone before arriving.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-2xl text-xs text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Want to pay in advance with bKash instead?</p>
                <p>You can use the <strong>Make Payment</strong> option to bKash number <strong>01353219518</strong> and submit your TrxID below for contactless delivery.</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Please complete your bKash Payment using the instructions below, then submit your Transaction ID (TrxID) to confirm your order.
            </p>
          )}

          {/* bKash Payment Card */}
          <div className="bg-white dark:bg-[#222] border-2 border-[#e2136e] rounded-2xl overflow-hidden shadow-sm mb-8">
            <div className="bg-[#e2136e] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">bKash Payment</span>
                <span className="text-xs bg-white/20 font-bold px-2 py-0.5 rounded">Make Payment</span>
              </div>
              <span className="text-xs font-semibold bg-white text-[#e2136e] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Official Store
              </span>
            </div>
            
            <div className="p-6">
              {/* Critical Alert */}
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Crucial:</strong> Use the <strong>"Payment" (Make Payment)</strong> option in your bKash app. 
                  <span className="text-red-600 font-bold underline ml-1">DO NOT select Send Money!</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Merchant / Payment Number</p>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-[#e2136e] tracking-wider mt-0.5">
                    01353219518
                  </p>
                </div>
                <Button 
                  onClick={() => copyNumber('01353219518')} 
                  variant="outline"
                  className="border-[#e2136e] text-[#e2136e] hover:bg-[#e2136e] hover:text-white font-bold h-11 px-5 gap-2 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Number!' : 'Copy Number'}
                </Button>
              </div>

              <div className="bg-[#e2136e]/5 p-4 rounded-xl mb-6">
                <p className="text-xs font-bold text-[#e2136e] uppercase tracking-wider mb-2">How to Pay in bKash App:</p>
                <ol className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5 list-decimal list-inside">
                  <li>Open your bKash App and tap on <strong>Payment (Make Payment)</strong>.</li>
                  <li>Enter Merchant / Payment Number: <strong className="font-mono font-bold text-[#e2136e]">01353219518</strong></li>
                  <li>Enter Amount: <strong className="font-bold">৳{orderInfo.total ? orderInfo.total.toLocaleString() : 'Total Amount'}</strong></li>
                  <li>Enter Reference: <strong className="font-mono font-bold text-[#1A1A1A] dark:text-white bg-white dark:bg-black px-1.5 py-0.5 rounded border">{orderInfo.orderNumber}</strong></li>
                  <li>Enter your bKash PIN to confirm transaction.</li>
                  <li>Copy your <strong>Transaction ID (TrxID)</strong> and submit below.</li>
                </ol>
              </div>

              {/* Instant TrxID Submission Form */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#076136]" /> Submit Your bKash Payment Proof
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Once you have paid via bKash, submit your TrxID below for instant validation by our store staff.
                </p>

                {trxSubmitted ? (
                  <div className="bg-green-50 dark:bg-green-950/40 border-2 border-green-500 rounded-2xl p-5 text-center text-green-800 dark:text-green-300">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-base">bKash Payment Submitted Successfully!</p>
                    <p className="text-xs mt-1">
                      TrxID: <span className="font-mono font-bold bg-white dark:bg-black px-2 py-0.5 rounded">{trxId.toUpperCase()}</span>
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                      Our dispatch team at Kuril Outlet has received your payment notification and is preparing your order.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTrxSubmit} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Sender bKash Phone Number
                        </label>
                        <Input
                          placeholder="e.g. 01XXXXXXXXX"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          className="h-11 font-mono text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          bKash Transaction ID (TrxID)
                        </label>
                        <Input
                          placeholder="e.g. BL48A9CD81"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="h-11 font-mono uppercase text-sm"
                          required
                        />
                      </div>
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-600 font-semibold">{submitError}</p>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isSubmittingTrx}
                      className="w-full h-11 bg-[#e2136e] hover:bg-[#c2105e] text-white font-bold text-sm"
                    >
                      {isSubmittingTrx ? 'Submitting Payment...' : 'Submit bKash TrxID'}
                    </Button>
                  </form>
                )}
              </div>

            </div>
          </div>

          <div className="bg-[#FDA701]/10 border border-[#FDA701]/30 p-4 rounded-xl text-center text-xs text-gray-700 dark:text-gray-300">
            <p className="font-bold text-[#1A1A1A] dark:text-white mb-0.5">Need Help with Payment?</p>
            <p>
              Call or WhatsApp our Kuril Outlet directly on <strong className="text-[#1A1A1A] dark:text-white">+880 1880-031355</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={orderInfo.orderNumber ? `/track-order?order=${encodeURIComponent(orderInfo.orderNumber)}` : '/track-order'} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-bold">
              Track My Order <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] h-14 px-8 text-base font-bold">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
