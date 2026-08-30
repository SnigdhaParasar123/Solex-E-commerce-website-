import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    login,
    register,
    forgotPassword,
    resetPassword,
    resetTokenData,
    setResetTokenData,
    setEmailSimulatorOpen
  } = useAuth();

  const { showToast } = useCart();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Reset password state
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  // Handle Quick Demo Login
  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await login('alex.rivera@example.com', 'SolexUser123!');
      showToast('Welcome back, Alex Rivera!', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      showToast('Logged in successfully! Step Into Greatness.', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      showToast('Account created successfully! Welcome to SOLEX.', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await forgotPassword(forgotEmail);
      setForgotSent(true);
      if (res.debugMail) {
        setResetCode(res.debugMail.code);
      }
      showToast('Password reset instructions sent to your email!', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        code: resetCode || resetTokenData.code,
        token: resetTokenData.token,
        newPassword
      });
      showToast('Password updated! You can now log in.', 'success');
      setAuthModalTab('login');
      setLoginEmail(forgotEmail || resetTokenData.email);
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white p-6 sm:p-8 animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1 text-2xl font-black font-['Outfit']">
            <span>SOLE</span>
            <span className="text-amber-500">X</span>
          </div>

          <h3 className="text-xl font-extrabold font-['Outfit']">
            {authModalTab === 'login' && 'Welcome Back'}
            {authModalTab === 'signup' && 'Create Your Account'}
            {authModalTab === 'forgot' && 'Reset Your Password'}
            {authModalTab === 'reset' && 'Set New Password'}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {authModalTab === 'login' && 'Sign in to access your orders, wishlist, and fast checkout.'}
            {authModalTab === 'signup' && 'Join the SOLEX club for exclusive drops and rewards.'}
            {authModalTab === 'forgot' && "Enter your email address and we'll send a password recovery code."}
            {authModalTab === 'reset' && 'Enter your verification code and choose a new password.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. LOGIN TAB */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* 1-Click Demo Login Banner */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">Testing credentials?</span>
                <span className="text-[11px] text-slate-500">Use preloaded demo customer</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                1-Click Login
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('forgot')}
                  className="text-amber-500 hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-10 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 font-black text-sm hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? <span>Authenticating...</span> : <span>Sign In to SOLEX</span>}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-3 text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalTab('signup')}
                className="text-amber-500 font-bold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGNUP TAB */}
        {authModalTab === 'signup' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-10 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-3 text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="text-amber-500 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD TAB */}
        {authModalTab === 'forgot' && (
          <div className="space-y-4">
            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Registered Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="alex.rivera@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <span>Sending Recovery Email...</span> : <span>Send Password Recovery Email</span>}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('login')}
                    className="text-xs text-slate-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Reset Email Dispatched!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    We sent a 6-digit verification code to <strong className="text-slate-800 dark:text-slate-200">{forgotEmail}</strong>.
                  </p>
                </div>

                {/* Simulated Mailbox Fast Action */}
                <div className="p-3.5 bg-slate-100 dark:bg-[#151c27] rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-500">Simulated Email Viewer</span>
                    <button
                      type="button"
                      onClick={() => setEmailSimulatorOpen(true)}
                      className="text-xs text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Mailbox</span>
                    </button>
                  </div>
                  {resetCode && (
                    <div className="text-xs text-slate-300">
                      Your verification code: <span className="font-mono font-black text-amber-400 text-sm">{resetCode}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAuthModalTab('reset')}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl cursor-pointer"
                >
                  Enter Code & Set New Password
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. RESET PASSWORD TAB */}
        {authModalTab === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="123456"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 tracking-wider"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-10 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? <span>Updating Password...</span> : <span>Save New Password & Sign In</span>}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="text-xs text-slate-400 hover:text-white hover:underline cursor-pointer"
              >
                Cancel and Return to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
