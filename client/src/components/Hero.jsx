import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Flame, ChevronRight } from 'lucide-react';

const heroSneakers = [
  {
    id: 'solex-jordan-1-retro-high',
    name: 'Nike Air Jordan 1 Retro High OG',
    tag: 'New Arrivals',
    model: 'Nike Air Jordan 1',
    colorway: 'Shadow Grey / Black / White',
    price: '$180.00',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-amber-500/20 to-orange-500/10'
  },
  {
    id: 'solex-jordan-4-retro',
    name: 'Air Jordan 4 Retro Bred Reimagined',
    tag: 'Hardwood Classic',
    model: 'Air Jordan 4 Retro',
    colorway: 'Fire Red / Cement Grey',
    price: '$210.00',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-rose-500/20 to-red-500/10'
  },
  {
    id: 'solex-nb-530',
    name: 'New Balance 530 Silver White',
    tag: 'Trending Lifestyle',
    model: 'New Balance 530',
    colorway: 'Silver Metallic / White',
    price: '$120.00',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-cyan-500/20 to-blue-500/10'
  }
];

export default function Hero({ onShopNow, onExploreBrands, onSelectProduct }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeShoe = heroSneakers[currentIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 dark:from-[#090c10] dark:via-[#0e131b] dark:to-[#090c10] border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Typography & CTA */}
          <div className="lg:col-span-6 space-y-6 z-10 text-center lg:text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Spring / Summer 2026 Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] font-['Outfit']">
              Step Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 dark:from-white dark:via-slate-200 dark:to-amber-400 bg-clip-text text-transparent">
                Greatness
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover authentic branded shoes for every step of your journey. High performance, iconic heritage, and uncompromising craftsmanship.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black dark:hover:text-black transition-all shadow-xl hover:shadow-amber-500/20 active:scale-98 cursor-pointer group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreBrands}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Explore Brands
              </button>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Verified Authentic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Fast Global Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Sneaker Showcase with Terrain & Floating Animation */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* Terrain & Floating Sneaker Box */}
            <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
              
              {/* Dynamic Rock/Terrain Backdrop */}
              <div className="absolute inset-x-4 bottom-2 h-28 sm:h-36 bg-gradient-to-t from-slate-900/90 via-slate-800/60 to-transparent rounded-3xl blur-md opacity-70 dark:opacity-90" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-slate-900/5 dark:from-slate-900/60 via-transparent to-amber-500/5 border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-sm" />

              {/* Sneaker Image with Float Animation */}
              <div
                className="relative z-10 w-full h-full p-4 sm:p-8 flex items-center justify-center cursor-pointer group"
                onClick={() => onSelectProduct && onSelectProduct(activeShoe.id)}
                title="Click to view details"
              >
                <img
                  key={activeShoe.id}
                  src={activeShoe.image}
                  alt={activeShoe.name}
                  className="w-full max-h-[380px] object-cover rounded-2xl shadow-2xl transition-all duration-700 ease-out transform group-hover:scale-105 group-hover:-rotate-1"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/90 dark:bg-black/90 text-xs font-bold px-4 py-2 rounded-full shadow-lg text-slate-900 dark:text-white flex items-center gap-1">
                    Quick View <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Bottom Right Floating Badge Matching Image Reference */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 bg-black/80 dark:bg-[#121721]/90 backdrop-blur-xl border border-white/10 dark:border-slate-700/80 px-4 py-3 rounded-2xl shadow-2xl text-white max-w-[220px]">
                <div className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
                  {activeShoe.tag}
                </div>
                <div className="text-xs font-bold truncate text-white mt-0.5">
                  {activeShoe.model}
                </div>

                {/* Dot Pagination Selector */}
                <div className="flex items-center gap-1.5 mt-2">
                  {heroSneakers.map((shoe, idx) => (
                    <button
                      key={shoe.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide to ${shoe.model}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sneaker Selector Thumbnails */}
            <div className="flex items-center gap-3 mt-4 z-20">
              {heroSneakers.map((shoe, idx) => (
                <button
                  key={shoe.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${currentIndex === idx ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  <span>{shoe.model.split(' ')[0]} {shoe.model.split(' ')[1]}</span>
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
