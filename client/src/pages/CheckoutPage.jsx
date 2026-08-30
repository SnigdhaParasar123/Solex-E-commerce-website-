import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  KeyRound,
  Printer,
  ChevronRight,
  DollarSign
} from 'lucide-react';

export default function CheckoutPage({ onContinueShopping, onOpenPaymentSettings }) {
  const { cart, subtotal, discountAmount, discountPercent, couponCode, shipping, tax, total, clearCart, showToast } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Order Confirmed
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Customer & Shipping Form State
  const [customer, setCustomer] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'OR',
    zipCode: user?.address?.zipCode || '',
    country: 'United States'
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState({
    id: 'standard',
    name: 'Standard Insured Ground',
    time: '3-5 Business Days',
    price: 0
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'paypal', 'apple_pay', 'cod'
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'ALEX RIVERA',
    cardExpiry: '12/28',
    cardCvc: '842'
  });

  // API Key in use
  const [activeApiKey, setActiveApiKey] = useState(() => {
    return localStorage.getItem('solex-payment-api-key') || 'pk_test_51MzSolexSecurePayLiveKey2026';
  });

  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        firstName: prev.firstName || user.name.split(' ')[0],
        lastName: prev.lastName || user.name.split(' ')[1] || '',
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || 'OR',
        zipCode: prev.zipCode || user.address?.zipCode || ''
      }));
    }
  }, [user]);

  // Card formatting helper
  const handleCardNumberChange = (val) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (val) => {
    let clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 3) {
      clean = clean.substring(0, 2) + '/' + clean.substring(2);
    }
    setCardDetails(prev => ({ ...prev, cardExpiry: clean }));
  };

  // Step 1: Validate & Go to Payment
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!customer.firstName || !customer.address || !customer.city || !customer.zipCode || !customer.email) {
      showToast('Please fill out all required shipping fields', 'error');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Process Payment & Place Order
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Process payment with API key
      const paymentPayload = {
        amount: total,
        currency: 'USD',
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null,
        apiKey: activeApiKey,
        billingAddress: customer
      };

      const paymentResult = await api.processPayment(paymentPayload);

      // 2. Create Order in database
      const orderPayload = {
        userId: user?.id || 'guest',
        customer,
        items: cart,
        shippingAddress: customer,
        shippingMethod,
        paymentResult,
        pricing: {
          subtotal,
          shipping,
          discount: discountAmount,
          discountCode: couponCode,
          tax,
          total
        }
      };

      const orderRes = await api.createOrder(orderPayload);
      setCreatedOrder(orderRes.order);
      clearCart();
      setCurrentStep(3);

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore confetti fallback
      }

      showToast('Order confirmed! Confirmation sent to your email.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast(err.message || 'Payment authorization failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Print Invoice
  const handlePrint = () => {
    window.print();
  };

  if (cart.length === 0 && currentStep !== 3) {
    return (
      <div className="py-20 max-w-xl mx-auto text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-['Outfit']">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">
          You don't have any sneakers in your bag to checkout yet.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-xl"
        >
          Explore Catalog & Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090c10] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Step Progress Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-amber-500' : 'text-slate-400'}`}>
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">1</span>
              <span>Shipping</span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 2 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-amber-500' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>2</span>
              <span>Payment Gateway</span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 3 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>3</span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* STEP 1 & 2: Main Checkout Form + Order Summary Sidebar */}
        {currentStep < 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Main Step Content (col-span-8) */}
            <div className="lg:col-span-8">
              
              {/* STEP 1: SHIPPING DETAILS */}
              {currentStep === 1 && (
                <form onSubmit={handleShippingSubmit} className="bg-white dark:bg-[#121721] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-black font-['Outfit']">1. Shipping & Contact Information</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Where should we deliver your fresh kicks?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">First Name *</label>
                      <input
                        type="text"
                        value={customer.firstName}
                        onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Name *</label>
                      <input
                        type="text"
                        value={customer.lastName}
                        onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address (for Receipt) *</label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Street Address *</label>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="123 Sneakerhead Blvd, Apt 4B"
                      required
                      className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City *</label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State *</label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ZIP Code *</label>
                      <input
                        type="text"
                        value={customer.zipCode}
                        onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                        required
                        className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Delivery Method Choice */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Select Delivery Speed
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setShippingMethod({ id: 'standard', name: 'Standard Insured Ground', time: '3-5 Business Days', price: 0 })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          shippingMethod.id === 'standard'
                            ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Standard Delivery</span>
                          <span className="text-emerald-500">{shipping === 0 ? 'FREE' : '$12.00'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">3-5 Business Days with tracking</p>
                      </div>

                      <div
                        onClick={() => setShippingMethod({ id: 'express', name: 'Priority Express Air', time: '1-2 Business Days', price: 15.00 })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          shippingMethod.id === 'express'
                            ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Priority Express Air</span>
                          <span className="text-amber-500">+$15.00</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">1-2 Business Days Priority Dispatch</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Payment Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: PAYMENT GATEWAY (STRIPE CARD + API KEY CONFIG) */}
              {currentStep === 2 && (
                <form onSubmit={handlePaymentSubmit} className="bg-white dark:bg-[#121721] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black font-['Outfit']">2. Secure Payment Gateway</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Encrypted 256-bit SSL transaction processing</p>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenPaymentSettings}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-amber-500 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>API Key Settings</span>
                    </button>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'paypal'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-base font-black italic text-blue-500">P</span>
                      <span>PayPal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'apple_pay'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Apple Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Cash on Deliv</span>
                    </button>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono tracking-widest">SOLEX SECURE PAY</span>
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        </div>

                        <div className="text-base sm:text-lg font-mono font-bold tracking-widest">
                          {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Card Holder</span>
                            <span className="font-semibold uppercase">{cardDetails.cardHolder || 'CARD HOLDER'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Expires</span>
                            <span className="font-mono font-semibold">{cardDetails.cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Card Number *</label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          required
                          className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name on Card *</label>
                        <input
                          type="text"
                          value={cardDetails.cardHolder}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                          placeholder="Alex Rivera"
                          required
                          className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expiration Date (MM/YY) *</label>
                          <input
                            type="text"
                            value={cardDetails.cardExpiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="12/28"
                            required
                            className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Security CVC *</label>
                          <input
                            type="text"
                            value={cardDetails.cardCvc}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardCvc: e.target.value.substring(0, 4) })}
                            placeholder="842"
                            required
                            className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Gateway API Key Badge */}
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                        API Key: {activeApiKey.substring(0, 16)}...
                      </span>
                    </div>
                    <span className="text-emerald-500 font-bold text-[11px]">Active & Verified</span>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {loading ? (
                        <span>Authorizing Payment...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ${(total + (shippingMethod.id === 'express' ? 15 : 0)).toFixed(2)} & Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Right Order Summary Sidebar (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#121721] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-28">
                <h3 className="text-base font-black font-['Outfit']">Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>

                {/* Items List Mini */}
                <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-slate-400">US {item.size} • Qty {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Line Items */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
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
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {shippingMethod.id === 'express' ? '$15.00' : shipping === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Due</span>
                    <span className="font-['Outfit'] text-amber-500">
                      ${(total + (shippingMethod.id === 'express' ? 15 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18202d] text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>30-Day Money Back Guarantee on all orders.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: ORDER CONFIRMATION & RECEIPT */}
        {currentStep === 3 && createdOrder && (
          <div className="max-w-3xl mx-auto space-y-8 animate-scale">
            
            {/* Success Hero Banner */}
            <div className="bg-white dark:bg-[#121721] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black text-amber-500 tracking-widest uppercase">
                  PAYMENT AUTHORIZED & VERIFIED
                </span>
                <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] mt-1">
                  Thank You for Your Order!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Order confirmation and tracking details sent to <strong className="text-slate-900 dark:text-white">{createdOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Order ID & Tracking Number Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Reference</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-base">{createdOrder.orderNumber}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Carrier Tracking #</span>
                  <span className="font-mono font-black text-amber-500 text-base">{createdOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Delivery Timeline Tracker */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Estimated Delivery: <strong className="text-slate-900 dark:text-white">{createdOrder.estimatedDelivery}</strong>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>1. Payment Verified</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>2. Packing for Dispatch</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#18202d] text-slate-400 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>3. In Transit</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt / Invoice</span>
                </button>

                <button
                  onClick={onContinueShopping}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-xl cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
