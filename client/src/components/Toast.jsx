import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 bg-white/95 text-slate-900 border-slate-200 dark:bg-[#151b26]/95 dark:text-white dark:border-slate-800">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
      
      <span className="text-sm font-medium pr-2">{toast.message}</span>
    </div>
  );
}
