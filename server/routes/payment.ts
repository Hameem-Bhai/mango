import express from 'express';
const router = express.Router();

// SSLCommerz sandbox credentials (replace with real ones in production)
const STORE_ID = 'your_store_id'; // Client must provide real store ID
const STORE_PASSWORD = 'your_store_password'; // Client must provide real password
const IS_LIVE = false; // Set to true in production

const SSLCOMMERZ_URL = IS_LIVE 
  ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

// POST /api/payment/initiate
// Called when customer clicks Checkout
router.post('/initiate', async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, customerAddress, total } = req.body;
    
    const orderNumber = 'MM-' + Date.now();
    
    // SSLCommerz payment data
    const paymentData = {
      store_id: STORE_ID,
      store_passwd: STORE_PASSWORD,
      total_amount: total,
      currency: 'BDT',
      tran_id: orderNumber,
      success_url: `${req.protocol}://${req.get('host')}/api/payment/success`,
      fail_url: `${req.protocol}://${req.get('host')}/api/payment/fail`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/payment/cancel`,
      ipn_url: `${req.protocol}://${req.get('host')}/api/payment/ipn`,
      product_name: items.map((i: any) => i.name).join(', '),
      product_category: 'Vape Products',
      product_profile: 'general',
      cus_name: customerName || 'Customer',
      cus_email: customerEmail || 'customer@mrmango.com',
      cus_add1: customerAddress || 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: customerPhone || '01880031355',
      shipping_method: 'Courier',
      ship_name: customerName || 'Customer',
      ship_add1: customerAddress || 'Dhaka',
      ship_city: 'Dhaka',
      ship_country: 'Bangladesh',
    };

    // NOTE: In production, call SSLCommerz API here using axios or node-fetch
    // For now, return sandbox redirect URL structure
    res.json({
      success: true,
      orderNumber,
      message: 'Payment initiated. SSLCommerz store credentials required for live payments.',
      paymentData,
      sandboxNote: 'Get your Store ID and Password from https://developer.sslcommerz.com/',
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// GET /api/payment/success
router.post('/success', (req, res) => {
  const { tran_id, amount, currency } = req.body;
  res.redirect(`/order-confirmation?order=${tran_id}&amount=${amount}&status=success`);
});

// GET /api/payment/fail
router.post('/fail', (req, res) => {
  res.redirect('/cart?payment=failed');
});

// GET /api/payment/cancel
router.post('/cancel', (req, res) => {
  res.redirect('/cart?payment=cancelled');
});

// IPN (Instant Payment Notification) from SSLCommerz
router.post('/ipn', (req, res) => {
  console.log('SSLCommerz IPN received:', req.body);
  res.status(200).send('OK');
});

export default router;
