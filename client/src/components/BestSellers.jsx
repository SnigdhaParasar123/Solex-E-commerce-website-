import React from 'react';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function BestSellers({ products, onQuickView, onViewAll }) {
  // Filter best sellers or take top 5-6 products
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 5);
  const displayList = bestSellers.length >= 4 ? bestSellers : products.slice(0, 5);

  return (
    <section className="py-16 bg-white dark:bg-[#090c10] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              BEST SELLERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 font-['Outfit']">
              Fan Favorites of the Season
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {displayList.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
