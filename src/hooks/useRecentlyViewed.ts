import { useState, useEffect } from 'react';
import { Product } from '@/types';

const STORAGE_KEY = 'mr_mango_recently_viewed';

export function useRecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed', e);
      }
    }
  }, []);

  const addProduct = (product: Product) => {
    setProducts((current) => {
      const filtered = current.filter((p) => p.slug !== product.slug);
      const updated = [product, ...filtered].slice(0, 4);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { products, addProduct };
}
