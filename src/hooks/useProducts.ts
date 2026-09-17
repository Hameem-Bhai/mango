import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface UseProductsParams {
  category?: string;
  search?: string;
  sort?: string;
}

export function useProducts(
  categoryOrParams?: string | UseProductsParams,
  searchParam?: string,
  sortParam?: string
) {
  let params: UseProductsParams = {};

  if (typeof categoryOrParams === 'object' && categoryOrParams !== null) {
    params = categoryOrParams;
  } else {
    params = {
      category: categoryOrParams,
      search: searchParam,
      sort: sortParam,
    };
  }

  // Normalize sort values: 'price-low' -> 'price-asc', 'price-high' -> 'price-desc', 'top-rated' -> 'rating'
  let normalizedSort = params.sort;
  if (normalizedSort === 'price-low') normalizedSort = 'price-asc';
  if (normalizedSort === 'price-high') normalizedSort = 'price-desc';
  if (normalizedSort === 'top-rated') normalizedSort = 'rating';

  const finalParams = {
    ...params,
    sort: normalizedSort
  };

  return useQuery({
    queryKey: ['products', finalParams],
    queryFn: () => api.fetchProducts(finalParams),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: api.fetchFeaturedProducts,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.fetchProductBySlug(slug),
    enabled: !!slug,
  });
}
