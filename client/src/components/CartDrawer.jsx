import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  Truck,
  Sparkles
} from 'lucide-react';

export default function CartDrawer({ onCheckout, onContinueShopping }) {
  const {
    cart,
    totalItems,
    subtotal,
    discountAmount,
    discountPercent,
    couponCode,
    shipping,
    tax,
    total,
    isFreeShipping,
    amountToFreeShipping,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyCoupon(inputCode);
      setInputCode('');
    }
  };

  const freeShippingProgress = Math.min(100, Math.round(((100 - amountToFreeShipping) / 100) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#10151f] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-slide-left text-slate-900 dark:text-slate-100">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-black font-['Outfit']">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-slate-50 dark:bg-[#151b28] px-6 py-3.5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Truck className="w-4 h-4 text-amber-500" />
                {isFreeShipping ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    🎉 You've unlocked FREE Standard Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-amber-500">${amountToFreeShipping.toFixed(2)}</strong> for FREE Shipping
                  </span>
                )}
              </div>
              <span className="text-slate-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our latest sneaker drops, best-sellers, and seasonal collection.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-[#18202e] p-2 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-800">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-slate-700 dark:text-slate-300">
                        US {item.size}
                      </span>
                      <span>•</span>
                      <span className="truncate">{item.color}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/80">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 dark:bg-[#131824] border-t border-slate-200 dark:border-slate-800 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. SUMMER40)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a2130] border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Active Coupon Badge */}
              {couponCode && (
                <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-600 dark:text-amber-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Coupon {couponCode} applied (-{discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-500 text-xs cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-500 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shipping === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="font-['Outfit']">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-4 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl hover:shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
