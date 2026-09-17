import express from 'express';
import db from '../db/connection';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const { category, search, sort } = req.query;
        
        let query = 'SELECT * FROM products WHERE 1=1';
        const params: any[] = [];
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR flavor LIKE ? OR description LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }
        
        if (sort === 'price-asc') {
            query += ' ORDER BY price ASC';
        } else if (sort === 'price-desc') {
            query += ' ORDER BY price DESC';
        } else if (sort === 'rating') {
            query += ' ORDER BY rating DESC';
        } else if (sort === 'featured') {
            query += ' ORDER BY featured DESC';
        } else {
            query += ' ORDER BY id DESC';
        }
        
        const products = db.prepare(query).all(...params);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/featured', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products WHERE featured = 1 LIMIT 8').all();
        res.json(products);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ error: 'Failed to fetch featured products' });
    }
});

router.get('/:slug', (req, res) => {
    try {
        const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Admin: Create Product
router.post('/', (req, res) => {
    try {
        const {
            name,
            slug: customSlug,
            flavor,
            flavors,
            description,
            price,
            compareAtPrice,
            colorHex = '#FDA701',
            puffCount,
            nicotine,
            volume,
            category = 'disposables',
            featured = 0,
            brand = 'Mr. Mango',
            imageUrl = '/brand/icon.png',
            inStock = 1
        } = req.body;

        if (!name || price == null) {
            return res.status(400).json({ error: 'Product name and price are required' });
        }

        let baseSlug = customSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!baseSlug) baseSlug = 'product';
        
        let slug = baseSlug;
        let counter = 1;
        while (db.prepare('SELECT 1 FROM products WHERE slug = ?').get(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const insert = db.prepare(`
            INSERT INTO products (slug, name, flavor, flavors, description, price, compareAtPrice, colorHex, puffCount, nicotine, volume, category, rating, reviewCount, featured, brand, imageUrl, inStock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = insert.run(
            slug,
            name.trim(),
            flavor || null,
            flavors || null,
            description || '',
            Number(price),
            compareAtPrice != null && String(compareAtPrice).trim() !== '' ? Number(compareAtPrice) : null,
            colorHex || '#FDA701',
            puffCount != null && String(puffCount).trim() !== '' ? Number(puffCount) : null,
            nicotine || null,
            volume || null,
            category || 'disposables',
            null,
            0,
            featured ? 1 : 0,
            brand || 'Mr. Mango',
            imageUrl || '/brand/icon.png',
            inStock === false || inStock === 0 ? 0 : 1
        );

        const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, id: result.lastInsertRowid, slug, product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Admin: Update Product
router.put('/:id', (req, res) => {
    try {
        const idParam = req.params.id;
        const numId = parseInt(idParam);
        const existing = (!isNaN(numId) ? db.prepare('SELECT * FROM products WHERE id = ?').get(numId) : null)
            || db.prepare('SELECT * FROM products WHERE slug = ?').get(idParam);

        if (!existing) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productId = existing.id;
        const b = req.body;

        const name = b.name !== undefined ? String(b.name).trim() : existing.name;
        const flavor = b.flavor !== undefined ? b.flavor : existing.flavor;
        const flavors = b.flavors !== undefined ? b.flavors : existing.flavors;
        const description = b.description !== undefined ? b.description : existing.description;
        const price = b.price !== undefined ? Number(b.price) : existing.price;
        const compareAtPrice = b.compareAtPrice !== undefined 
            ? (b.compareAtPrice && String(b.compareAtPrice).trim() !== '' ? Number(b.compareAtPrice) : null) 
            : existing.compareAtPrice;
        const colorHex = b.colorHex !== undefined ? b.colorHex : existing.colorHex;
        const puffCount = b.puffCount !== undefined 
            ? (b.puffCount && String(b.puffCount).trim() !== '' ? Number(b.puffCount) : null) 
            : existing.puffCount;
        const nicotine = b.nicotine !== undefined ? b.nicotine : existing.nicotine;
        const volume = b.volume !== undefined ? b.volume : existing.volume;
        const category = b.category !== undefined ? b.category : existing.category;
        const featured = b.featured !== undefined ? (b.featured ? 1 : 0) : existing.featured;
        const brand = b.brand !== undefined ? b.brand : existing.brand;
        const imageUrl = b.imageUrl !== undefined ? b.imageUrl : existing.imageUrl;
        const inStock = b.inStock !== undefined ? (b.inStock === false || b.inStock === 0 ? 0 : 1) : existing.inStock;

        db.prepare(`
            UPDATE products SET
                name = ?,
                flavor = ?,
                flavors = ?,
                description = ?,
                price = ?,
                compareAtPrice = ?,
                colorHex = ?,
                puffCount = ?,
                nicotine = ?,
                volume = ?,
                category = ?,
                featured = ?,
                brand = ?,
                imageUrl = ?,
                inStock = ?
            WHERE id = ?
        `).run(
            name,
            flavor,
            flavors,
            description,
            price,
            compareAtPrice,
            colorHex,
            puffCount,
            nicotine,
            volume,
            category,
            featured,
            brand,
            imageUrl,
            inStock,
            productId
        );

        const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
        res.json({ success: true, message: 'Product updated successfully', product: updated });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Admin: Delete Product
router.delete('/:id', (req, res) => {
    try {
        const idParam = req.params.id;
        const numId = parseInt(idParam);
        const existing = (!isNaN(numId) ? db.prepare('SELECT * FROM products WHERE id = ?').get(numId) : null)
            || db.prepare('SELECT * FROM products WHERE slug = ?').get(idParam);

        if (!existing) {
            return res.status(404).json({ error: 'Product not found' });
        }

        db.prepare('DELETE FROM products WHERE id = ?').run(existing.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
