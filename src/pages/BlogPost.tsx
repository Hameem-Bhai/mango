import { useParams, Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useBlogPost } from '@/hooks/useBlog';

export function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied to clipboard!' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
        <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-16 bg-gray-200 rounded w-full mb-10"></div>
        <div className="h-64 bg-gray-200 rounded-2xl mb-10"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button className="bg-[#FDA701] text-white hover:bg-[#FDA701]/90">
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <SEO title={`${post.title} — Mr.Mango.com`} description={post.excerpt} />
      
      <div className="bg-[#1A1A1A] py-16 border-b border-gray-800 text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-gray-400 hover:text-[#FDA701] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
          <span className="text-sm font-bold text-[#076136] uppercase tracking-wider mb-4 block bg-[#076136]/20 px-3 py-1 rounded-full w-max mx-auto">{post.category || 'General'}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-gray-400 text-sm">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {post.image && (
          <div className="h-64 md:h-96 bg-gray-100 rounded-2xl mb-10 overflow-hidden shadow-md">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="prose prose-lg max-w-none text-gray-700">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleShare} className="text-gray-500 hover:text-[#FDA701]">
            <Share2 className="h-5 w-5 mr-2" /> Share Post
          </Button>
        </div>
      </div>
    </>
  );
}
