import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog'],
    queryFn: () => api.fetchBlogPosts(),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.fetchBlogPost(slug),
    enabled: !!slug,
  });
}
