import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

export default function ShopPage({
  products,
  onQuickView,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedGender,
  setSelectedGender
}) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(250);
  const [onlySale, setOnlySale] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Running', 'Lifestyle', 'Basketball', 'Training', 'Sneakers', 'Slides', 'Boots'];
  const brands = ['All', 'Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Converse', 'Vans', 'Timberland'];
  const genders = ['All', 'Men', 'Women', 'Kids', 'Unisex'];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        if (selectedCategory && selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        // Brand
        if (selectedBrand && selectedBrand !== 'All' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
        // Gender
        if (selectedGender && selectedGender !== 'All') {
          const matchGender = p.gender.toLowerCase() === selectedGender.toLowerCase() || p.gender.toLowerCase() === 'unisex';
          if (!matchGender) return false;
        }
        // Sale only
        if (onlySale && !p.isOnSale && (!p.discount || p.discount <= 0)) {
          return false;
        }
        // Price Range
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // featured
      });
  }, [products, selectedCategory, selectedBrand, selectedGender, onlySale, minPrice, maxPrice, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedGender('All');
    setOnlySale(false);
    setMinPrice(0);
    setMaxPrice(250);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedBrand !== 'All' || selectedGender !== 'All' || onlySale || maxPrice < 250 || minPrice > 0 || searchQuery !== '';

  return (
    <div className="py-10 bg-slate-50 dark:bg-[#090c10] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              SOLEX CATALOG
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] mt-1">
              Explore All Footwear ({filteredProducts.length})
            </h1>
          </div>

          {/* Sort Dropdown & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-sm"
            >
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white dark:bg-[#121721] border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-white dark:bg-[#121721]">Sort by: Featured</option>
                <option value="price-low" className="bg-white dark:bg-[#121721]">Price: Low to High</option>
                <option value="price-high" className="bg-white dark:bg-[#121721]">Price: High to Low</option>
                <option value="rating" className="bg-white dark:bg-[#121721]">Customer Rating</option>
                <option value="newest" className="bg-white dark:bg-[#121721]">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3 hover:text-slate-900" /></button>
              </span>
            )}
            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('All')}><X className="w-3 h-3 hover:text-slate-900" /></button>
              </span>
            )}
            {selectedGender !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
                Gender: {selectedGender}
                <button onClick={() => setSelectedGender('All')}><X className="w-3 h-3 hover:text-slate-900" /></button>
              </span>
            )}
            {onlySale && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 font-bold">
                On Sale Only
                <button onClick={() => setOnlySale(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-500 hover:underline font-bold ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-[#121721] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Category Filter */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Categories
                </h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory?.toLowerCase() === cat.toLowerCase()
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory?.toLowerCase() === cat.toLowerCase() && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Brands
                </h4>
                <div className="space-y-1">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedBrand?.toLowerCase() === brand.toLowerCase()
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{brand}</span>
                      {selectedBrand?.toLowerCase() === brand.toLowerCase() && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Gender
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {genders.map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedGender?.toLowerCase() === g.toLowerCase()
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-black uppercase tracking-wider text-slate-400">
                    Max Price
                  </h4>
                  <span className="font-mono font-bold text-amber-500">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>$50</span>
                  <span>$150</span>
                  <span>$250</span>
                </div>
              </div>

              {/* On Sale Switch */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="flex items-center justify-between text-xs font-bold cursor-pointer">
                  <span>Show On Sale Only</span>
                  <input
                    type="checkbox"
                    checked={onlySale}
                    onChange={(e) => setOnlySale(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* Product Grid (col-span-9) */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#121721] rounded-3xl p-16 text-center space-y-4 border border-slate-200 dark:border-slate-800">
                <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold">No Shoes Match Your Filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try widening your price range or clearing some category/brand selections.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
