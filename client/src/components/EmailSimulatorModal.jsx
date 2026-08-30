import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  X,
  Mail,
  RefreshCw,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Receipt,
  ExternalLink
} from 'lucide-react';

export default function EmailSimulatorModal() {
  const {
    emailSimulatorOpen,
    setEmailSimulatorOpen,
    inboxEmails,
    refreshInbox,
    openAuthModal,
    setResetTokenData
  } = useAuth();

  const { showToast } = useCart();

  if (!emailSimulatorOpen) return null;

  const handleUseResetCode = (mail) => {
    if (mail.resetToken || mail.body.includes('Verification Code:')) {
      // Extract code if present
      const match = mail.body.match(/Verification Code:\s*(\d{6})/);
      const code = match ? match[1] : '';
      
      setResetTokenData({
        token: mail.resetToken || '',
        code: code,
        email: mail.to
      });

      setEmailSimulatorOpen(false);
      openAuthModal('reset', {
        token: mail.resetToken,
        code,
        email: mail.to
      });
      showToast(`Loaded verification code ${code} into reset form!`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white p-6 sm:p-8 animate-scale flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-['Outfit']">
                Simulated Email Inbox ({inboxEmails.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect real-time password recovery codes and order invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                refreshInbox();
                showToast('Mailbox refreshed', 'info');
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Refresh inbox"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmailSimulatorOpen(false)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mail List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
          {inboxEmails.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Mail className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No emails sent yet.</p>
              <p className="text-xs max-w-xs mx-auto">
                Trigger a "Forgot Password" or complete a checkout order to see dispatched emails appear live here!
              </p>
            </div>
          ) : (
            inboxEmails.map(mail => (
              <div key={mail.id} className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full uppercase">
                        {mail.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        To: {mail.to}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {mail.subject}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Email Body Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {mail.body}
                </div>

                {/* Password Reset Action Button */}
                {mail.type === 'password_reset' && (
                  <button
                    onClick={() => handleUseResetCode(mail)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Auto-Fill Code in Password Reset Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
