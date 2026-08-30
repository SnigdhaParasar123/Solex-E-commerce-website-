import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Lock } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On orders over $100'
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    desc: 'Hassle-free returns'
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    desc: 'Genuine branded products'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    desc: 'Safe & encrypted checkout'
  }
];

export default function FeaturesBar() {
  return (
    <section className="py-12 bg-white dark:bg-[#0c1017] border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#131924]/60 border border-slate-100 dark:border-slate-800/80 transition-all hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
