import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, products, onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = searchTerm.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products.slice(0, 4); // Default suggestions

  const quickTags = ['Jordan', 'Nike', 'Running', '40% OFF', 'New Balance', 'Slides'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111622] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search shoes, brands (Nike, Jordan, Vans), categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold placeholder-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#151b28] border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold whitespace-nowrap">Trending:</span>
          {quickTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag.replace('40% OFF', ''))}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {searchTerm ? `Results (${filteredProducts.length})` : 'Popular Searches & Recommendations'}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm font-semibold">No shoes found matching "{searchTerm}"</p>
              <p className="text-xs">Try searching for Nike, Jordan, Running, or Lifestyle</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product.id);
                  onClose();
                }}
                className="pt-3 first:pt-0 flex items-center justify-between gap-4 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {product.brand} • {product.category}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-amber-500 font-bold flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
