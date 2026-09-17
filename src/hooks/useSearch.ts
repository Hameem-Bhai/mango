import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSearch(delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => api.fetchProducts({ search: debouncedSearch }),
    enabled: debouncedSearch.length > 0,
  });

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    results: results || [],
    isLoading,
    isSearchOpen,
    openSearch,
    closeSearch,
  };
}
