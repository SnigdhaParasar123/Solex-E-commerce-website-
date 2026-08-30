import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Mail,
  KeyRound,
  LogOut,
  Sliders,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  onOpenSearch,
  onOpenPaymentSettings,
  activeFilterCategory,
  setActiveFilterCategory,
  activeGender,
  setActiveGender
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openAuthModal, logout, setEmailSimulatorOpen, inboxEmails } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist, setIsWishlistOpen } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadMails = inboxEmails.filter(m => !m.read).length;

  const handleNavClick = (view, gender = 'All', category = 'All') => {
    setCurrentView(view);
    if (gender !== undefined) setActiveGender(gender);
    if (category !== undefined) setActiveFilterCategory(category);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-[#111620] text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span>🚚 Free shipping on all orders over $100</span>
            <span className="text-slate-600">|</span>
            <span>Easy 30-day returns</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-amber-400 font-semibold">
              🔥 Use code <span className="underline decoration-amber-400">SUMMER40</span> for 40% OFF
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            {/* Quick Email Simulator trigger */}
            <button
              onClick={() => setEmailSimulatorOpen(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer bg-slate-800/80 hover:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700"
              title="View sent password reset emails and order confirmation receipts"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>Mail Simulator</span>
              {inboxEmails.length > 0 && (
                <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {inboxEmails.length}
                </span>
              )}
            </button>

            {/* Payment Gateway API Key Config Modal Trigger */}
            <button
              onClick={onOpenPaymentSettings}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Gateway API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="glass-header border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-1 text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-900 dark:text-white cursor-pointer group"
              >
                <span className="tracking-tight font-black font-['Outfit']">SOLE</span>
                <span className="text-amber-500 group-hover:scale-110 transition-transform font-['Outfit'] font-black">X</span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className={`relative py-2 cursor-pointer transition-colors ${
                  currentView === 'home'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Home
                {currentView === 'home' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('shop', 'All', 'All')}
                className={`relative py-2 cursor-pointer transition-colors ${
                  currentView === 'shop' && activeGender === 'All'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Shop
                {currentView === 'shop' && activeGender === 'All' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('shop', 'Men', 'All')}
                className={`relative py-2 cursor-pointer transition-colors ${
                  currentView === 'shop' && activeGender === 'Men'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Men
                {currentView === 'shop' && activeGender === 'Men' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('shop', 'Women', 'All')}
                className={`relative py-2 cursor-pointer transition-colors ${
                  currentView === 'shop' && activeGender === 'Women'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Women
                {currentView === 'shop' && activeGender === 'Women' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('shop', 'Kids', 'All')}
                className={`relative py-2 cursor-pointer transition-colors ${
                  currentView === 'shop' && activeGender === 'Kids'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Kids
                {currentView === 'shop' && activeGender === 'Kids' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('shop', 'All', 'All')}
                className="relative py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                Brands
              </button>

              <button
                onClick={() => handleNavClick('shop', 'All', 'All', true)}
                className="relative py-2 text-rose-500 hover:text-rose-600 font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>Sale</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Search shoes"
                title="Search shoes, brands, and categories"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer relative"
                aria-label="Toggle light/dark theme"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Liked Items / Wishlist Heart Icon */}
              <button
                onClick={() => setCurrentView('wishlist')}
                className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group"
                aria-label="Liked items"
                title="View Liked Items"
              >
                <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${totalWishlist > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {totalWishlist > 0 && (
                  <span className="absolute 0 top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-scale">
                    {totalWishlist}
                  </span>
                )}
              </button>

              {/* Cart Shopping Bag Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group"
                aria-label="Shopping Cart"
                title="Open Cart Drawer"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Profile / Auth Button */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-amber-500"
                      />
                      <span className="hidden md:inline text-xs font-semibold max-w-[80px] truncate text-slate-800 dark:text-slate-200">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* User Dropdown Menu */}
                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#141a24] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-medium text-slate-400">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>

                        <button
                          onClick={() => handleNavClick('profile')}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-amber-500" />
                          <span>My Account & Orders</span>
                        </button>

                        <button
                          onClick={() => {
                            handleNavClick('profile');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4 text-amber-500" />
                          <span>Change Password</span>
                        </button>

                        <button
                          onClick={() => setEmailSimulatorOpen(true)}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Mail className="w-4 h-4 text-amber-500" />
                          <span>Sent Emails ({inboxEmails.length})</span>
                        </button>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black dark:hover:text-black transition-colors cursor-pointer shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fade-in">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', 'All', 'All')}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Men', 'All')}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Men's Collection
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Women', 'All')}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Women's Collection
            </button>
            <button
              onClick={() => handleNavClick('shop', 'Kids', 'All')}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Kids' Collection
            </button>
            <button
              onClick={() => handleNavClick('wishlist')}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Liked Items</span>
              {totalWishlist > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{totalWishlist}</span>}
            </button>
            <button
              onClick={() => setEmailSimulatorOpen(true)}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium text-amber-500 hover:bg-amber-500/10 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Simulated Mail Inbox ({inboxEmails.length})</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
