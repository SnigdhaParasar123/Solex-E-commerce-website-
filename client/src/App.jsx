import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { api } from './services/api';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TopBrands from './components/TopBrands';
import ShopByCategory from './components/ShopByCategory';
import BestSellers from './components/BestSellers';
import SummerSaleBanner from './components/SummerSaleBanner';
import FeaturesBar from './components/FeaturesBar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import EmailSimulatorModal from './components/EmailSimulatorModal';
import PaymentApiKeyModal from './components/PaymentApiKeyModal';
import InfoModals from './components/InfoModals';
import Toast from './components/Toast';

// Pages
import ShopPage from './pages/ShopPage';
import LikedItemsPage from './pages/LikedItemsPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';

function MainApp() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'shop', 'wishlist', 'checkout', 'profile'
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Filters State
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [activeGender, setActiveGender] = useState('All');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [paymentSettingsOpen, setPaymentSettingsOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState(null); // 'sizeGuide', 'shipping', 'returns', 'faq', 'contact', 'about', 'terms', 'privacy'

  const { openAuthModal } = useAuth();
  const { applyCoupon, setIsCartOpen } = useCart();

  // Load products catalog from backend API
  useEffect(() => {
    async function loadInitialProducts() {
      try {
        const res = await api.getProducts();
        setProducts(res.products || []);
      } catch (err) {
        console.error('Error fetching products from API:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadInitialProducts();
  }, []);

  // Check URL params for resetToken / hash navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('resetToken');
    const code = params.get('code');
    if (resetToken || code) {
      openAuthModal('reset', { token: resetToken, code });
    }
  }, []);

  const handleSelectProduct = async (productId) => {
    try {
      const found = products.find(p => p.id === productId);
      if (found) {
        setSelectedProduct(found);
      } else {
        const res = await api.getProductById(productId);
        setSelectedProduct(res.product);
      }
    } catch (err) {
      console.error('Error loading product details:', err);
    }
  };

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBrand = (brandName) => {
    setActiveBrand(brandName);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopSale = () => {
    applyCoupon('SUMMER40');
    setActiveCategory('All');
    setActiveBrand('All');
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (view, gender = 'All', category = 'All', isSale = false) => {
    setCurrentView(view);
    if (gender !== undefined) setActiveGender(gender);
    if (category !== undefined) setActiveCategory(category);
    if (isSale) {
      applyCoupon('SUMMER40');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sticky Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenPaymentSettings={() => setPaymentSettingsOpen(true)}
        activeFilterCategory={activeCategory}
        setActiveFilterCategory={setActiveCategory}
        activeGender={activeGender}
        setActiveGender={setActiveGender}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <div>
            {/* Hero Showcase Matching Reference */}
            <Hero
              onShopNow={() => handleNavClick('shop')}
              onExploreBrands={() => {
                const el = document.getElementById('top-brands-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectProduct={handleSelectProduct}
            />

            {/* Top Brands Bar */}
            <div id="top-brands-section">
              <TopBrands
                activeBrand={activeBrand}
                onSelectBrand={handleSelectBrand}
                onViewAll={() => handleNavClick('shop')}
              />
            </div>

            {/* Shop by Category */}
            <ShopByCategory
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Best Sellers Grid */}
            <BestSellers
              products={products}
              onQuickView={setSelectedProduct}
              onViewAll={() => handleNavClick('shop')}
            />

            {/* Summer Sale 40% OFF Promo Banner */}
            <SummerSaleBanner onShopSale={handleShopSale} />

            {/* Value Propositions / Features Bar */}
            <FeaturesBar />
          </div>
        )}

        {/* 2. SHOP CATALOG VIEW */}
        {currentView === 'shop' && (
          <ShopPage
            products={products}
            onQuickView={setSelectedProduct}
            selectedCategory={activeCategory}
            setSelectedCategory={setActiveCategory}
            selectedBrand={activeBrand}
            setSelectedBrand={setActiveBrand}
            selectedGender={activeGender}
            setSelectedGender={setActiveGender}
          />
        )}

        {/* 3. LIKED ITEMS / WISHLIST VIEW */}
        {currentView === 'wishlist' && (
          <LikedItemsPage
            onQuickView={setSelectedProduct}
            onExploreShop={() => handleNavClick('shop')}
          />
        )}

        {/* 4. CHECKOUT & PAYMENT GATEWAY VIEW */}
        {currentView === 'checkout' && (
          <CheckoutPage
            onContinueShopping={() => handleNavClick('shop')}
            onOpenPaymentSettings={() => setPaymentSettingsOpen(true)}
          />
        )}

        {/* 5. USER PROFILE & CHANGE PASSWORD VIEW */}
        {currentView === 'profile' && (
          <ProfilePage
            onExploreShop={() => handleNavClick('shop')}
          />
        )}
      </main>

      {/* Footer Matching Reference Design */}
      <Footer
        onNavClick={handleNavClick}
        onOpenModal={(type) => setInfoModalType(type)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onCheckout={() => setCurrentView('checkout')}
        onContinueShopping={() => setCurrentView('shop')}
      />

      {/* Product Detail & Size Picker Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOpenSizeGuide={() => setInfoModalType('sizeGuide')}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Full Auth Modal (Login / Signup / Forgot Password / Reset Password) */}
      <AuthModal />

      {/* Simulated Email Inbox Viewer Modal */}
      <EmailSimulatorModal />

      {/* Payment Gateway API Key Config Modal */}
      <PaymentApiKeyModal
        isOpen={paymentSettingsOpen}
        onClose={() => setPaymentSettingsOpen(false)}
      />

      {/* Customer Care & Info Modals */}
      <InfoModals
        activeModal={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Global Animated Toasts */}
      <Toast />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
