import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDb } from './db/connection';
import productRoutes from './routes/products';
import blogRoutes from './routes/blog';
import faqRoutes from './routes/faq';
import contactRoutes from './routes/contact';
import orderRoutes from './routes/orders';
import newsletterRoutes from './routes/newsletter';
import paymentRoutes from './routes/payment';
import waitlistRoutes from './routes/waitlist';
import promoRoutes from './routes/promos';
import authRoutes from './routes/auth';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database backup endpoint for Admin
app.get('/api/admin/backup', (_req, res) => {
  const dbPath = path.join(__dirname, 'db', 'mrmango_db.json');
  if (fs.existsSync(dbPath)) {
    res.download(dbPath, `mrmango_backup_${new Date().toISOString().slice(0, 10)}.json`);
  } else {
    res.status(404).json({ error: 'Database backup not found' });
  }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/auth', authRoutes);

// Serve frontend static build in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize DB and start server
initializeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});// Server initialized with single Kuril outlet at Tong Market beside AIUB gate
