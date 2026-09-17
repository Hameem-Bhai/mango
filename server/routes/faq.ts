import express from 'express';
import db from '../db/connection';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const faqs = db.prepare('SELECT * FROM faq_items ORDER BY category, sortOrder').all() as any[];
        
        // Group by category
        const grouped = faqs.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, any[]>);
        
        res.json(grouped);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
});

export default router;
