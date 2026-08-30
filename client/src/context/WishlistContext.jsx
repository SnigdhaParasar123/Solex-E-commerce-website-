import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('solex-wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { showToast, addToCart } = useCart();

  useEffect(() => {
    localStorage.setItem('solex-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      showToast(`Removed ${product.name} from your Liked Items`, 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`Added ${product.name} to your Liked Items ❤️`, 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    showToast('Removed from Liked Items', 'info');
  };

  const moveToCart = (product, size) => {
    const chosenSize = size || product.sizes?.[0] || 9.0;
    const added = addToCart(product, chosenSize, product.colors?.[0] || 'Standard', 1);
    if (added) {
      removeFromWishlist(product.id);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalWishlist: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
