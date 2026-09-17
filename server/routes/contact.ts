import express from 'express';
import db from '../db/connection';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }
        
        const stmt = db.prepare('INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)');
        const result = stmt.run(name, email, subject || '', message);
        
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

// Admin: Get all contact submissions
router.get('/', (_req, res) => {
    try {
        const submissions = db.prepare('SELECT * FROM contact_submissions ORDER BY id DESC').all();
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).json({ error: 'Failed to fetch contact submissions' });
    }
});

// Admin: Delete contact submission
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(id);
        res.json({ success: true, message: 'Submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Failed to delete submission' });
    }
});

export default router;
