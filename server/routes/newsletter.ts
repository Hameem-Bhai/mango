import express from 'express';
import db from '../db/connection';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Check if already subscribed
        const existing = db.prepare('SELECT 1 FROM newsletter_subscribers WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ error: 'Email is already subscribed' });
        }
        
        db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email);
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'Failed to subscribe to newsletter' });
    }
});

// Admin: Get all subscribers
router.get('/', (_req, res) => {
    try {
        const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY id DESC').all();
        res.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
});

// Admin: Delete subscriber
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        db.prepare('DELETE FROM newsletter_subscribers WHERE id = ?').run(id);
        res.json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).json({ error: 'Failed to delete subscriber' });
    }
});

export default router;
