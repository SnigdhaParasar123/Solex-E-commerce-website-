import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('solex-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('solex-cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const addToCart = (product, size, color, quantity = 1) => {
    if (!size) {
      showToast('Please select a shoe size first', 'error');
      return false;
    }

    const selectedColor = color || (product.colors && product.colors[0]) || 'Standard';
    const cartItemId = `${product.id}-${size}-${selectedColor}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            product,
            size,
            color: selectedColor,
            price: product.price,
            quantity
          }
        ];
      }
    });

    showToast(`Added ${product.name} (US ${size}) to your bag!`, 'success');
    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'SUMMER40') {
      setCouponCode('SUMMER40');
      setDiscountPercent(40);
      showToast('Summer Sale 40% OFF discount applied!', 'success');
      return { success: true, message: '40% discount applied!' };
    } else if (clean === 'SOLEX10') {
      setCouponCode('SOLEX10');
      setDiscountPercent(10);
      showToast('10% Welcome discount applied!', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'FREESHIP') {
      setCouponCode('FREESHIP');
      setDiscountPercent(0);
      showToast('Free express shipping code applied!', 'success');
      return { success: true, message: 'Free shipping unlocked!' };
    } else {
      showToast('Invalid promo code. Try SUMMER40 or SOLEX10', 'error');
      return { success: false, message: 'Invalid coupon code.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    showToast('Promo code removed', 'info');
  };

  // Computations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const isFreeShipping = discountedSubtotal >= 100 || couponCode === 'FREESHIP' || totalItems === 0;
  const shipping = totalItems === 0 ? 0 : isFreeShipping ? 0 : 12.00;
  const tax = totalItems === 0 ? 0 : +(discountedSubtotal * 0.08).toFixed(2);
  const total = totalItems === 0 ? 0 : +(discountedSubtotal + shipping + tax).toFixed(2);
  const amountToFreeShipping = Math.max(0, 100 - discountedSubtotal);

  return (
    <CartContext.Provider
      value={{
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
        toast,
        showToast,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
