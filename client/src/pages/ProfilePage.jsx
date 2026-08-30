import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import {
  User,
  KeyRound,
  Package,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Truck,
  Mail,
  LogOut,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function ProfilePage({ onExploreShop }) {
  const { user, isAuthenticated, token, changePassword, updateProfile, logout, setEmailSimulatorOpen, openAuthModal } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('password'); // 'password', 'orders', 'info'
  
  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Profile Edit Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || 'OR');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setStreet(user.address?.street || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || 'OR');
      setZipCode(user.address?.zipCode || '');
    }
  }, [user]);

  // Load User Orders
  useEffect(() => {
    async function loadOrders() {
      if (user?.id) {
        setOrdersLoading(true);
        try {
          const res = await api.getUserOrders(user.id);
          setOrders(res.orders || []);
        } catch (err) {
          console.error('Failed to load user orders:', err);
        } finally {
          setOrdersLoading(false);
        }
      }
    }
    loadOrders();
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="py-24 max-w-md mx-auto text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-['Outfit']">Sign In Required</h2>
        <p className="text-xs text-slate-400">
          Please log in to manage your SOLEX account, view order history, or update your password.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-8 py-3.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-xl"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Your account password has been updated!', 'success');
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Profile Update Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({
        name,
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country: 'United States'
        }
      });
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090c10] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Profile Header Card */}
        <div className="bg-white dark:bg-[#121721] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black font-['Outfit']">{user.name}</h1>
                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  SOLEX VIP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
              <p className="text-[11px] text-slate-500">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEmailSimulatorOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulated Inbox</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'password'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Address & Details</span>
          </button>
        </div>

        {/* TAB 1: CHANGE PASSWORD */}
        {activeTab === 'password' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white dark:bg-[#121721] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-black font-['Outfit']">Change Account Password</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your security password for SOLEX account authentication.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Your password has been changed successfully!</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Current Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 pl-10 pr-10 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 pl-10 pr-10 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      required
                      className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-xl cursor-pointer mt-2"
                >
                  {passwordLoading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-[#121721] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                <div className="flex items-center gap-2 text-amber-500 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Security Recommendations</span>
                </div>
                <ul className="space-y-2 text-slate-500 dark:text-slate-400 leading-relaxed list-disc pl-4">
                  <li>Use at least 8 characters including numbers and symbols.</li>
                  <li>Avoid using common dictionary words or personal dates.</li>
                  <li>If you forget your password in the future, use the "Forgot Password" link on the sign-in modal to receive a 6-digit recovery code.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-[#121721] rounded-3xl p-16 text-center space-y-4 border border-slate-200 dark:border-slate-800">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold">No Past Orders Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you purchase sneakers, your live status tracking and receipts will appear here.
                </p>
                <button
                  onClick={onExploreShop}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shadow-md"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-[#121721] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-black font-['Outfit']">Order #{order.orderNumber}</h3>
                          <span className="bg-emerald-500/10 text-emerald-500 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          ${order.pricing.total.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-amber-500 font-mono font-semibold">
                          Tracking: {order.trackingNumber}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {order.items.map(item => (
                        <div key={item.cartItemId} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#18202d] border border-slate-200/60 dark:border-slate-700">
                          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold truncate">{item.product.name}</h4>
                            <p className="text-[10px] text-slate-400">US {item.size} • Qty {item.quantity}</p>
                            <span className="text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer / Tracking Info */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-600 dark:text-amber-400">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>Estimated Arrival: <strong>{order.estimatedDelivery}</strong></span>
                      </div>
                      <span className="font-mono text-[11px]">Carrier: Solex Express Logistics</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADDRESS & PROFILE DETAILS */}
        {activeTab === 'info' && (
          <div className="bg-white dark:bg-[#121721] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-black font-['Outfit']">Saved Details & Address</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pre-fills your details during checkout.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ZIP Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-xl cursor-pointer"
              >
                {profileLoading ? 'Saving Changes...' : 'Save Details'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
