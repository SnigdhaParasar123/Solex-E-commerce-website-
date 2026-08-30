import React from 'react';

const categoryList = [
  {
    name: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    count: '18 items'
  },
  {
    name: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80',
    count: '24 items'
  },
  {
    name: 'Basketball',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=400&q=80',
    count: '15 items'
  },
  {
    name: 'Training',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=400&q=80',
    count: '12 items'
  },
  {
    name: 'Sneakers',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
    count: '32 items'
  },
  {
    name: 'Slides',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=400&q=80',
    count: '8 items'
  },
  {
    name: 'Boots',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
    count: '10 items'
  }
];

export default function ShopByCategory({ activeCategory, onSelectCategory }) {
  return (
    <section className="py-14 bg-slate-50 dark:bg-[#090c10] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-['Outfit']">
              Engineered For Every Move
            </p>
          </div>
        </div>

        {/* Categories Horizontal Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 sm:gap-6">
          {categoryList.map(cat => {
            const isSelected = activeCategory?.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-105' : 'hover:-translate-y-1'
                }`}
              >
                {/* Pill Image Card */}
                <div
                  className={`w-full aspect-square rounded-2xl p-3 flex items-center justify-center transition-all overflow-hidden relative shadow-sm ${
                    isSelected
                      ? 'bg-amber-500/15 border-2 border-amber-500 shadow-amber-500/20'
                      : 'bg-white dark:bg-[#141a24] border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                  />
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </div>

                {/* Category Label */}
                <span
                  className={`mt-3 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                    isSelected
                      ? 'text-amber-500 font-extrabold'
                      : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
