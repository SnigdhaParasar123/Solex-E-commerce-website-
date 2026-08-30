import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function SummerSaleBanner({ onShopSale }) {
  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-slate-50 dark:bg-[#090c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-[#090c12] border border-slate-800 text-white shadow-2xl p-8 sm:p-12 lg:p-14">
          
          {/* Background Ambient Glows & Water Graphic Accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge & Timer */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black tracking-wider uppercase border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  LIMITED TIME ONLY
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ends in {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Outfit']">
                  Summer Sale
                </h2>
                <p className="text-slate-400 text-base sm:text-lg mt-2 font-medium">
                  Up to 40% off on selected premium performance & lifestyle footwear.
                </p>
              </div>

              {/* Promo Code Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <span>Use Code at Checkout:</span>
                <span className="font-mono font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md">
                  SUMMER40
                </span>
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={onShopSale}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-950 font-black text-sm hover:bg-amber-400 hover:text-black transition-all shadow-xl hover:shadow-amber-500/25 active:scale-98 cursor-pointer group"
                >
                  <span>Shop the Sale</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Right Graphic: Water Splash Sneaker & Huge 40% OFF */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Giant 40% OFF Typography */}
              <div className="absolute right-0 sm:right-4 z-0 pointer-events-none select-none">
                <div className="text-7xl sm:text-9xl lg:text-[130px] font-black text-amber-500/80 tracking-tighter font-['Outfit'] leading-none flex flex-col items-end opacity-90 drop-shadow-2xl">
                  <span>40%</span>
                  <span className="text-4xl sm:text-6xl lg:text-7xl text-amber-400/90 -mt-2">OFF</span>
                </div>
              </div>

              {/* Water Splash Sneaker Visual */}
              <div className="relative z-10 w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85"
                  alt="Summer Sale Hydro Shoe"
                  className="w-full max-h-[300px] object-cover rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
