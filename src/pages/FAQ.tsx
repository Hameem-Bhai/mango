import { useState, useEffect, useMemo } from 'react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { Search, HelpCircle, MessageSquare } from 'lucide-react';

export function FAQ() {
  const [groupedFaqs, setGroupedFaqs] = useState<Record<string, any[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        setGroupedFaqs(data);
      })
      .catch(err => console.error('Failed to fetch FAQs:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return ['all', ...Object.keys(groupedFaqs)];
  }, [groupedFaqs]);

  const allItems = useMemo(() => {
    const list: any[] = [];
    Object.entries(groupedFaqs).forEach(([cat, items]) => {
      items.forEach(item => {
        list.push({ ...item, category: cat });
      });
    });
    return list;
  }, [groupedFaqs]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) || 
        item.answer.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allItems, activeCategory, searchQuery]);

  return (
    <>
      <SEO 
        title="Frequently Asked Questions — Mr.Mango.com BD" 
        description="Find answers about Mr. Mango vape products, Kuril Dhaka outlet (beside AIUB), bKash/Nagad payment methods, same-day delivery, and warranty."
      />
      
      <div className="bg-[#1A1A1A] text-white py-16 border-b border-[#FDA701]">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FDA701] bg-[#FDA701]/10 px-3.5 py-1 rounded-full">
            Help & Knowledge Base
          </span>
          <h1 className="text-4xl font-bold text-[#FAF5E7] mt-3 mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Everything you need to know about our products, outlet locations, delivery across Bangladesh, and ordering policies.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search questions or keywords (e.g. delivery, bKash)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:bg-white focus:text-black focus:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-[#121212] py-12 min-h-[60vh] transition-colors">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-[#FDA701] text-[#1A1A1A] shadow-sm'
                    : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-[#FDA701]'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-white dark:bg-[#1a1a1a] rounded-xl animate-pulse border border-gray-100 dark:border-gray-800"></div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1a1a] p-12 rounded-2xl text-center border border-gray-200 dark:border-gray-800">
              <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="font-bold text-lg text-gray-700 dark:text-gray-200">No matching questions found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try a different search keyword or switch categories.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredItems.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${faq.id}`} 
                  className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-1 shadow-xs"
                >
                  <AccordionTrigger className="text-left font-bold text-[#1A1A1A] dark:text-white hover:no-underline hover:text-[#FDA701] text-base">
                    <span className="flex items-center gap-2">
                      <span className="text-xs bg-[#FDA701]/10 text-[#FDA701] px-2 py-0.5 rounded font-mono font-medium">
                        {faq.category}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 pt-2 pb-4 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          
          {/* Still have questions CTA */}
          <div className="mt-16 bg-[#1A1A1A] rounded-3xl p-8 sm:p-10 text-center text-white border border-[#FDA701]/30 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Still have questions?</h2>
              <p className="text-gray-300 mb-6 max-w-lg mx-auto text-sm sm:text-base">
                Our support team is active 11:00 AM – 11:00 PM daily. Contact us directly on WhatsApp or drop by our Kuril outlet (Tong Market, beside AIUB).
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/contact">
                  <Button className="bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold px-6 h-12">
                    Contact Form
                  </Button>
                </Link>
                <a href="https://wa.me/8801880031355" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold px-6 h-12 gap-2">
                    <MessageSquare className="w-4 h-4" /> WhatsApp Us (+880 1880-031355)
                  </Button>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
