import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  tag: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: '1',
    image: '/products/elfbar-raya-s1-15k.png',
    likes: 342,
    comments: 28,
    caption: '15,000 puffs of pure flavor! Elfbar Raya S1 now in stock at our Kuril outlet (beside AIUB).',
    tag: '#ElfBarBD'
  },
  {
    id: '2',
    image: '/products/bar-juice-30ml.webp',
    likes: 419,
    comments: 34,
    caption: 'Restocked your favorite Bar Juice flavors. Free delivery across Dhaka for 2+ bottles!',
    tag: '#BarJuice'
  },
  {
    id: '3',
    image: '/products/flyto-10k-full-kit.png',
    likes: 275,
    comments: 19,
    caption: 'Flyto 10K kit with swappable cartridges. Never run out of charge or puff.',
    tag: '#FlytoVape'
  },
  {
    id: '4',
    image: '/products/vct-juice-30ml.webp',
    likes: 512,
    comments: 47,
    caption: 'The legendary Vanilla Custard Tobacco. Smooth throat hit, rich aroma.',
    tag: '#RipeVapes'
  },
  {
    id: '5',
    image: '/products/kiligbar-6k-full-kit.webp',
    likes: 198,
    comments: 15,
    caption: 'Pocket-friendly companion for your daily commute in Dhaka.',
    tag: '#Kiligbar'
  },
  {
    id: '6',
    image: '/brand/icon.png',
    likes: 680,
    comments: 63,
    caption: 'Our Kuril outlet beside AIUB main gate is open until 11 PM tonight. Come test flavors!',
    tag: '#MrMangoBD'
  }
];

export function InstagramFeed() {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#141414] border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#FDA701] font-bold text-sm uppercase tracking-wider mb-2">
                <Instagram className="w-4 h-4" /> Follow @mrmango.bd
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-white">
                Dhaka's Vaping Community
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-md">
                Tag <span className="font-semibold text-[#1A1A1A] dark:text-gray-200">#MrMangoBD</span> on Instagram to get featured on our feed!
              </p>
            </div>
            
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="shrink-0"
            >
              <Button variant="outline" className="border-gray-300 dark:border-gray-700 hover:border-[#FDA701] dark:hover:border-[#FDA701] gap-2">
                <Instagram className="w-4 h-4 text-[#FDA701]" />
                Follow on Instagram <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <FadeIn key={post.id} delay={idx * 0.05}>
              <div className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#1c1c1c] border border-gray-100 dark:border-gray-800">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-end">
                    <Instagram className="w-5 h-5 text-[#FDA701]" />
                  </div>
                  <div>
                    <p className="text-[11px] line-clamp-3 text-gray-200 mb-2">{post.caption}</p>
                    <span className="text-[10px] text-[#FDA701] font-semibold">{post.tag}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-white/20">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
