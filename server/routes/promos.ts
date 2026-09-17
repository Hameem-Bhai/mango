import express from 'express';

const router = express.Router();

const PROMO_CODES: Record<string, { type: 'percent' | 'flat'; value: number; minOrder?: number; label: string }> = {
    'MANGO10': { type: 'percent', value: 10, label: '10% Off Special' },
    'MRMANGO50': { type: 'flat', value: 50, label: '৳50 Off Mr. Mango' },
    'WELCOMEBD': { type: 'percent', value: 5, label: '5% Welcome Discount' },
    'DHAKA2026': { type: 'flat', value: 100, minOrder: 1500, label: '৳100 Off orders over ৳1,500' }
};

router.post('/validate', (req, res) => {
    try {
        const { code, subtotal = 0 } = req.body;
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });
        }

        const normalizedCode = code.trim().toUpperCase();
        const promo = PROMO_CODES[normalizedCode];

        if (!promo) {
            return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
        }

        if (promo.minOrder && subtotal < promo.minOrder) {
            return res.status(400).json({
                valid: false,
                message: `This coupon requires a minimum subtotal of ৳${promo.minOrder.toLocaleString()}`
            });
        }

        let discount = 0;
        if (promo.type === 'percent') {
            discount = Math.round((subtotal * promo.value) / 100);
        } else {
            discount = Math.min(promo.value, subtotal);
        }

        res.json({
            valid: true,
            code: normalizedCode,
            discount,
            type: promo.type,
            value: promo.value,
            label: promo.label
        });
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({ valid: false, message: 'Failed to validate promo code' });
    }
});

export default router;
