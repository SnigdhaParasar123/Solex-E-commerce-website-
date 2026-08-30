import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Star,
  Check
} from 'lucide-react';

export default function LikedItemsPage({ onQuickView, onExploreShop }) {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const { addToCart, showToast } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleMoveToCart = (product) => {
    const size = selectedSizes[product.id] || product.sizes?.[0] || 9.0;
    moveToCart(product, size);
  };

  const handleAddAllToCart = () => {
    let count = 0;
    wishlist.forEach(item => {
      const size = selectedSizes[item.id] || item.sizes?.[0] || 9.0;
      addToCart(item, size, item.colors?.[0] || 'Standard', 1);
      count++;
    });
    if (count > 0) {
      showToast(`Added all ${count} items to your shopping bag!`, 'success');
      clearWishlist();
    }
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090c10] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                SAVED FOR LATER
              </span>
              <h1 className="text-3xl font-black font-['Outfit'] mt-0.5">
                My Liked Items ({wishlist.length})
              </h1>
            </div>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-colors cursor-pointer"
              >
                Clear All
              </button>

              <button
                onClick={handleAddAllToCart}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        {/* Liked Items Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-[#121721] rounded-3xl p-16 text-center space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-['Outfit']">Your Liked Items List is Empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Tap the heart icon on any shoe card to save your favorite grails and sneaker drops here.
            </p>
            <button
              onClick={onExploreShop}
              className="px-8 py-3.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-all shadow-xl cursor-pointer"
            >
              Explore Best Sellers & Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map(product => {
              const selectedSize = selectedSizes[product.id] || product.sizes?.[0] || 9.0;
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#121721] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Shoe image */}
                    <div
                      onClick={() => onQuickView(product)}
                      className="relative aspect-[4/3] my-3 rounded-2xl bg-slate-50 dark:bg-[#18202d]/50 p-2 flex items-center justify-center cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Shoe Title & Price */}
                    <div className="space-y-1">
                      <h3
                        onClick={() => onQuickView(product)}
                        className="text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-amber-500"
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          In Stock
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Size Dropdown & Move to Bag Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Select Size:</span>
                      <select
                        value={selectedSize}
                        onChange={(e) => handleSizeChange(product.id, parseFloat(e.target.value))}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        {product.sizes.map(size => (
                          <option key={size} value={size}>
                            US {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag • US {selectedSize}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
