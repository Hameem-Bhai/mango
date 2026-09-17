import express from 'express';
import db from '../db/connection';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const { category } = req.query;
        
        let query = 'SELECT * FROM blog_posts';
        const params: any[] = [];
        
        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }
        
        query += ' ORDER BY publishedAt DESC';
        
        const posts = db.prepare(query).all(...params);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

router.get('/:slug', (req, res) => {
    try {
        const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
        
        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        
        res.json(post);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});

export default router;
