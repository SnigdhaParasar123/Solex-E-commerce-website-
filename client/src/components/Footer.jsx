import React, { useState } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  ArrowRight,
  Check,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Footer({ onNavClick, onOpenModal }) {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(email);
      showToast(res.message, 'success');
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      showToast(err.message || 'Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#070a0e] text-slate-400 border-t border-slate-900 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-850">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-1 text-2xl font-extrabold tracking-wider text-white">
              <span className="font-['Outfit'] font-black">SOLE</span>
              <span className="text-amber-500 font-['Outfit'] font-black">X</span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your destination for authentic branded shoes. Quality, style, and comfort — all in one place.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#instagram"
                onClick={(e) => { e.preventDefault(); showToast('Redirecting to Instagram @SolexFootwear'); }}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-black text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#facebook"
                onClick={(e) => { e.preventDefault(); showToast('Redirecting to Facebook SOLEX'); }}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-black text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.592 0 9 1.592 9 4.714V8z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                onClick={(e) => { e.preventDefault(); showToast('Redirecting to Twitter / X @SolexKicks'); }}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-black text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#tiktok"
                onClick={(e) => { e.preventDefault(); showToast('Redirecting to TikTok @SolexOfficial'); }}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-black text-slate-300 flex items-center justify-center transition-all cursor-pointer text-xs font-bold font-mono"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-white uppercase font-['Outfit']">
              SHOP
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavClick('shop', 'All', 'All')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Shoes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop', 'Men', 'All')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Men
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop', 'Women', 'All')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Women
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop', 'Kids', 'All')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kids
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('shop', 'All', 'All', true)}
                  className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                >
                  Sale Drops 🔥
                </button>
              </li>
            </ul>
          </div>

          {/* CUSTOMER CARE Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-white uppercase font-['Outfit']">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('returns')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('sizeGuide')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-white uppercase font-['Outfit']">
              COMPANY
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenModal('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Careers portal opening soon!')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Solex Eco-Craft initiative: 100% recycled packaging by 2027.')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sustainability
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Check out our Sneakerhead Journal on SOLEX blog')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Store Locator: 24 Flagship locations across North America')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Store Locator
                </button>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-white uppercase font-['Outfit']">
              NEWSLETTER
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get updates on new arrivals, exclusive offers and more.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || subscribed}
                className="w-full bg-[#131924] border border-slate-800 rounded-full py-2.5 pl-4 pr-11 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 w-8 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                {subscribed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-emerald-400 block">
                ✓ Check your inbox for 10% coupon code!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 SOLEX. All Rights Reserved.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => onOpenModal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onOpenModal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
