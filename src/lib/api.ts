import { Product, BlogPost, FAQItem, ContactForm, Order, NewsletterSubscription } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  fetchProducts: async (params?: { category?: string; search?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    
    const qs = query.toString();
    return fetchAPI<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  fetchFeaturedProducts: async () => {
    return fetchAPI<Product[]>('/products?featured=true');
  },

  fetchProductBySlug: async (slug: string) => {
    return fetchAPI<Product>(`/products/${slug}`);
  },

  fetchProductsByCategory: async (categoryId: string) => {
    return fetchAPI<Product[]>(`/products?categoryId=${categoryId}`);
  },

  fetchBlogPosts: async () => {
    return fetchAPI<BlogPost[]>('/blog');
  },

  fetchBlogPost: async (slug: string) => {
    return fetchAPI<BlogPost>(`/blog/${slug}`);
  },

  fetchFAQ: async () => {
    return fetchAPI<FAQItem[]>('/faq');
  },

  submitContact: async (data: ContactForm) => {
    return fetchAPI<{ success: boolean }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createOrder: async (orderData: Partial<Order>) => {
    return fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  trackOrder: async (orderId: string) => {
    return fetchAPI<Order>(`/orders/${orderId}`);
  },

  subscribeNewsletter: async (data: NewsletterSubscription) => {
    return fetchAPI<{ success: boolean }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
