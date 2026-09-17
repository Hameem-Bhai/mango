import express from 'express';
import db from '../db/connection';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const items = db.prepare('SELECT * FROM waitlist ORDER BY id DESC').all();
        res.json(items);
    } catch (error) {
        console.error('Error fetching waitlist:', error);
        res.status(500).json({ error: 'Failed to fetch waitlist' });
    }
});

router.post('/', (req, res) => {
    try {
        const { productId, productName, customerName, customerPhone } = req.body;
        if (!customerName || !customerPhone) {
            return res.status(400).json({ error: 'Customer name and phone number are required' });
        }

        const insert = db.prepare(`
            INSERT INTO waitlist (productId, productName, customerName, customerPhone)
            VALUES (?, ?, ?, ?)
        `);

        const result = insert.run(productId || null, productName || 'Product', customerName, customerPhone);
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error recording waitlist:', error);
        res.status(500).json({ error: 'Failed to record waitlist entry' });
    }
});

router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        db.prepare('DELETE FROM waitlist WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing waitlist item:', error);
        res.status(500).json({ error: 'Failed to delete waitlist entry' });
    }
});

export default router;
