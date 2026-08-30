import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Share2
} from 'lucide-react';

export default function ProductDetailModal({ product, isOpen, onClose, onOpenSizeGuide }) {
  const { addToCart, showToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize(product.sizes?.[0] || 9.0);
      setSelectedColor(product.colors?.[0] || 'Standard');
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product.id);
  const images = product.galleryImages || [product.image];

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please pick a size first', 'error');
      return;
    }
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white my-8 animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
          
          {/* Left Gallery (col-span-6) */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Main Featured Image */}
            <div className="relative aspect-[4/3] rounded-3xl bg-slate-50 dark:bg-[#18202e] p-4 flex items-center justify-center overflow-hidden border border-slate-200/80 dark:border-slate-800">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-500 hover:scale-105"
              />

              {product.isOnSale && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.discount}% OFF SALE
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl p-2 bg-slate-50 dark:bg-[#18202e] border transition-all shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="Angle thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Authenticity & Guarantee Notes */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">100% Authentic</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center gap-1">
                <Truck className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Free US Shipping</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center gap-1">
                <RotateCcw className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Right Product Details (col-span-6) */}
          <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="uppercase tracking-widest text-amber-500 font-bold">{product.brand}</span>
                <span>{product.gender} • {product.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] leading-tight">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-400">
                  Based on {product.reviewCount} customer ratings
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.inStock ? (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    In Stock ({product.stockCount} left)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Colorways */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Color: <span className="text-amber-500 font-semibold">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(col => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          selectedColor === col
                            ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Select Size (US Men / Unisex)
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="flex items-center gap-1 text-amber-500 hover:text-amber-600 font-semibold cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md scale-105'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      US {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 pt-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

            </div>

            {/* Actions: Add to Cart, Wishlist, Share */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              
              <div className="flex gap-3">
                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • US {selectedSize}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Heart Toggle */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:border-rose-400'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:border-amber-400 transition-colors cursor-pointer"
                  title="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
