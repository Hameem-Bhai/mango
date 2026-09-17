import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlog';

export function Blog() {
  const { data: posts, isLoading } = useBlogPosts();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Guides', 'Reviews', 'Tips'];
  
  const filteredPosts = posts?.filter(post => 
    activeCategory === 'All' ? true : post.category === activeCategory
  ) || [];

  return (
    <>
      <SEO title="Vape Guides & Tips — Mr.Mango.com" />
      <div className="bg-[#1A1A1A] py-16 border-b border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Vape Guides & Tips</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Learn how to get the most out of your vape</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={activeCategory === cat ? 'bg-[#FDA701] text-white hover:bg-[#FDA701]/90 border-none' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="cursor-pointer">
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-[#076136] uppercase tracking-wider bg-[#076136]/10 px-2 py-1 rounded-full">{post.category || 'General'}</span>
                        <span className="text-xs text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h2 className="text-xl font-bold text-[#1A1A1A] mb-3 line-clamp-2 group-hover:text-[#FDA701] transition-colors">{post.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1A1A1A]">{post.author}</span>
                        <span className="text-[#FDA701] font-bold text-sm">Read More &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No blog posts found for this category.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
