import { Link } from 'wouter';
import { FadeIn } from '@/components/ui/FadeIn';

const categories = [
  {
    id: 'disposables',
    name: 'Disposables',
    description: 'Ready-to-use vape devices',
    color: '#076136',
  },
  {
    id: 'pod-kits',
    name: 'Pod Kits',
    description: 'Refillable and pre-filled systems',
    color: '#FDA701',
  },
  {
    id: 'e-liquids',
    name: 'E-Liquids',
    description: 'Premium vape juices & salts',
    color: '#1A1A1A',
  },
  {
    id: 'coils-tanks',
    name: 'Coils & Parts',
    description: 'Replacement cartridges, pods, and coils',
    color: '#6b7280',
  }
];

export function CategoryGrid() {
  return (
    <section className="py-16 bg-white dark:bg-[#121212] transition-colors">
      <FadeIn>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1A1A1A] dark:text-white mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/shop/${category.id}`}>
                <div className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-48 bg-white dark:bg-[#1a1a1a] flex flex-col justify-end p-6 border border-gray-100 dark:border-gray-800">
                  <div 
                    className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">{category.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
