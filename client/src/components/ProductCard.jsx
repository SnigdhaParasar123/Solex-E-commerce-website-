import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 9.0);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!selectedSize) {
      setShowSizePicker(true);
      return;
    }
    const success = addToCart(product, selectedSize, product.colors?.[0] || 'Standard', 1);
    if (success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
      setShowSizePicker(false);
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white dark:bg-[#121721] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges & Wishlist Heart */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          {product.isOnSale && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && !product.isOnSale && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-500 text-white scale-110 shadow-md shadow-rose-500/30'
              : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-105'
          }`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Sneaker Image */}
      <div className="relative aspect-[4/3] my-3 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 dark:bg-[#18202d]/50 p-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-colors shadow-lg cursor-pointer text-xs font-bold flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{product.gender} • {product.category}</span>
          <span className="font-semibold">{product.brand}</span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
          {product.name}
        </h3>

        {/* Price and Rating Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount >= 1000 ? `${(product.reviewCount/1000).toFixed(1)}k` : product.reviewCount})</span>
          </div>
        </div>

        {/* Size Selection Drawer / Trigger */}
        {showSizePicker ? (
          <div
            className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-1.5 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Select Size (US)</span>
              <button
                onClick={() => setShowSizePicker(false)}
                className="text-rose-500 hover:underline"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.slice(0, 8).map(size => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 mt-1 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black dark:hover:text-black transition-colors"
            >
              Confirm & Add US {selectedSize}
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSizePicker(true);
            }}
            className={`w-full mt-3 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
