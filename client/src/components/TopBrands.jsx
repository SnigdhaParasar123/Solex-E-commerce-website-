import React from 'react';
import { ChevronRight } from 'lucide-react';

const brands = [
  { name: 'Nike', slug: 'nike', logo: 'NIKE' },
  { name: 'Adidas', slug: 'adidas', logo: 'adidas' },
  { name: 'Puma', slug: 'puma', logo: 'PUMA' },
  { name: 'New Balance', slug: 'newbalance', logo: 'new balance' },
  { name: 'Converse', slug: 'converse', logo: '★ CONVERSE' },
  { name: 'Vans', slug: 'vans', logo: 'VANS "OFF THE WALL"' }
];

export default function TopBrands({ activeBrand, onSelectBrand, onViewAll }) {
  return (
    <section className="py-8 bg-white dark:bg-[#0d1118] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Label */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              TOP BRANDS
            </span>
          </div>

          {/* Brands Row */}
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 overflow-x-auto py-2 scrollbar-none">
            {brands.map(brand => {
              const isActive = activeBrand?.toLowerCase() === brand.name.toLowerCase();
              return (
                <button
                  key={brand.name}
                  onClick={() => onSelectBrand(brand.name)}
                  className={`group flex items-center justify-center px-4 py-2 rounded-xl text-sm tracking-tight font-black transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-['Outfit'] font-black tracking-wider uppercase">
                    {brand.logo}
                  </span>
                </button>
              );
            })}

            {/* View all button */}
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer pl-2 whitespace-nowrap"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
