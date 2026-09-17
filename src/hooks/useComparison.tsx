import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isInCompare: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (compareList.length < 3 && !compareList.find((p) => p.slug === product.slug)) {
      setCompareList([...compareList, product]);
    }
  };

  const removeFromCompare = (slug: string) => {
    setCompareList(compareList.filter((p) => p.slug !== slug));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (slug: string) => {
    return !!compareList.find((p) => p.slug === slug);
  };

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a CompareProvider');
  }
  return context;
}
