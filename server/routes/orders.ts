import express from 'express';
import db from '../db/connection';

const router = express.Router();

function generateOrderNumber() {
    const chars = '0123456789';
    let rand = '';
    for (let i = 0; i < 5; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MM-${new Date().getFullYear()}-${rand}`;
}

// Admin: Get all orders
router.get('/', (_req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
        const formatted = orders.map(ord => {
            let parsedItems = ord.items;
            if (typeof ord.items === 'string') {
                try {
                    parsedItems = JSON.parse(ord.items);
                } catch {
                    parsedItems = ord.items;
                }
            }
            return {
                ...ord,
                items: parsedItems
            };
        });
        res.json(formatted);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Checkout: Create new order
router.post('/', (req, res) => {
    try {
        const { 
            customerName, 
            customerPhone, 
            customerAddress, 
            email, 
            items, 
            subtotal, 
            discount = 0, 
            shipping = 0, 
            total, 
            paymentMethod = 'Cash on Delivery',
            status = 'placed',
            trxId = '',
            senderPhone = '',
            paymentStatus = 'pending'
        } = req.body;
        
        if (!items || (!email && !customerPhone)) {
            return res.status(400).json({ error: 'Customer contact and items are required' });
        }
        
        let orderNumber = generateOrderNumber();
        // Simple collision check
        while (db.prepare('SELECT 1 FROM orders WHERE orderNumber = ?').get(orderNumber)) {
            orderNumber = generateOrderNumber();
        }
        
        const stmt = db.prepare(`
            INSERT INTO orders (orderNumber, customerName, customerPhone, customerAddress, email, items, subtotal, discount, shipping, total, paymentMethod, status, trxId, senderPhone, paymentStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            orderNumber,
            customerName || 'Valued Customer',
            customerPhone || '',
            customerAddress || '',
            email || customerPhone || '',
            typeof items === 'string' ? items : JSON.stringify(items),
            Number(subtotal || total),
            Number(discount || 0),
            Number(shipping || 0),
            Number(total),
            paymentMethod,
            status,
            trxId,
            senderPhone,
            trxId ? 'submitted' : paymentStatus
        );
        
        res.status(201).json({ success: true, id: result.lastInsertRowid, orderNumber });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Customer/Admin: Submit or update payment TrxID
router.patch('/:orderNumber/payment', (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const { trxId, senderPhone, paymentStatus = 'submitted' } = req.body;

        const existing = db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(orderNumber);
        if (!existing) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const cleanTrx = String(trxId || '').trim().toUpperCase();
        const cleanPhone = String(senderPhone || '').trim().replace(/[^0-9]/g, '');

        // Strict bKash TrxID format validation: must be 8-12 alphanumeric characters
        if (!cleanTrx || !/^[A-Z0-9]{8,12}$/.test(cleanTrx)) {
            return res.status(400).json({ 
                error: 'Invalid bKash Transaction ID format. Must be 8-12 alphanumeric characters (e.g. BL48A9CD81).' 
            });
        }

        // Strict Bangladeshi phone number validation: 11 digits starting with 01[3-9]
        if (!cleanPhone || !/^(?:88)?01[3-9]\d{8}$/.test(cleanPhone)) {
            return res.status(400).json({ 
                error: 'Invalid bKash sender phone number. Must be a valid 11-digit Bangladeshi mobile number (e.g. 01XXXXXXXXX).' 
            });
        }

        db.prepare(`
            UPDATE orders SET
                trxId = ?,
                senderPhone = ?,
                paymentStatus = ?
            WHERE orderNumber = ?
        `).run(
            cleanTrx,
            cleanPhone,
            paymentStatus,
            orderNumber
        );

        const updated = db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(orderNumber);
        res.json({ success: true, message: 'Payment information updated successfully', order: updated });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ error: 'Failed to update payment information' });
    }
});

// Admin: Update order status / details
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = (!isNaN(id) ? db.prepare('SELECT * FROM orders WHERE id = ?').get(id) : null)
            || db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(req.params.id);

        if (!existing) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const body = req.body;
        const status = body.status !== undefined ? body.status : existing.status;
        const customerName = body.customerName !== undefined ? body.customerName : existing.customerName;
        const customerPhone = body.customerPhone !== undefined ? body.customerPhone : existing.customerPhone;
        const customerAddress = body.customerAddress !== undefined ? body.customerAddress : existing.customerAddress;
        const paymentMethod = body.paymentMethod !== undefined ? body.paymentMethod : existing.paymentMethod;
        const trxId = body.trxId !== undefined ? body.trxId : (existing.trxId || '');
        const senderPhone = body.senderPhone !== undefined ? body.senderPhone : (existing.senderPhone || '');
        const paymentStatus = body.paymentStatus !== undefined ? body.paymentStatus : (existing.paymentStatus || 'pending');

        db.prepare(`
            UPDATE orders SET
                status = ?,
                customerName = ?,
                customerPhone = ?,
                customerAddress = ?,
                paymentMethod = ?,
                trxId = ?,
                senderPhone = ?,
                paymentStatus = ?
            WHERE id = ?
        `).run(
            status,
            customerName,
            customerPhone,
            customerAddress,
            paymentMethod,
            trxId,
            senderPhone,
            paymentStatus,
            existing.id
        );

        const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(existing.id);
        res.json({ success: true, message: 'Order updated successfully', order: updated });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Admin: Delete order
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = (!isNaN(id) ? db.prepare('SELECT * FROM orders WHERE id = ?').get(id) : null)
            || db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(req.params.id);

        if (!existing) {
            return res.status(404).json({ error: 'Order not found' });
        }

        db.prepare('DELETE FROM orders WHERE id = ?').run(existing.id);
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

// Tracking: Track order by orderNumber
router.get('/:orderNumber/track', (req, res) => {
    try {
        const order = db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(req.params.orderNumber);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        let parsedItems = order.items;
        if (typeof order.items === 'string') {
            try {
                parsedItems = JSON.parse(order.items);
            } catch {
                parsedItems = order.items;
            }
        }

        res.json({
            ...order,
            items: parsedItems
        });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ error: 'Failed to track order' });
    }
});

export default router;
