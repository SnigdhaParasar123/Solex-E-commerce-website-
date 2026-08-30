import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, KeyRound, ShieldCheck, Check, Sparkles, CreditCard, Lock } from 'lucide-react';

export default function PaymentApiKeyModal({ isOpen, onClose }) {
  const { showToast } = useCart();
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('solex-payment-api-key') || 'pk_test_51MzSolexSecurePayLiveKey2026';
  });
  const [testMode, setTestMode] = useState(true);
  const [merchantName, setMerchantName] = useState('SOLEX GLOBAL INC');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('solex-payment-api-key', apiKey.trim());
    showToast('Payment Gateway API key configured successfully!', 'success');
    onClose();
  };

  const handleResetDefault = () => {
    const defaultKey = 'pk_test_51MzSolexSecurePayLiveKey2026';
    setApiKey(defaultKey);
    localStorage.setItem('solex-payment-api-key', defaultKey);
    showToast('Reset to default Sandbox API key', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white p-6 sm:p-8 animate-scale space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-['Outfit']">
                Payment Gateway API Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stripe & Digital Payment API Key Configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>
            256-Bit SSL Encrypted. API Keys are safely used to authenticate checkout sessions.
          </span>
        </div>

        {/* API Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Stripe / Gateway Publishable API Key</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] text-amber-500 hover:underline cursor-pointer"
              >
                Use Test Sandbox Key
              </button>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="pk_test_..."
                className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Provide your custom Stripe Publishable API Key or use the pre-authenticated test sandbox key.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Merchant Account Label
            </label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Gateway API Key</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
