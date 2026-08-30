import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Ruler, Truck, RotateCcw, HelpCircle, Mail, Info, FileText, CheckCircle2 } from 'lucide-react';

export default function InfoModals({ activeModal, onClose }) {
  const { showToast } = useCart();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!activeModal) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    showToast('Your message has been sent to SOLEX Concierge!', 'success');
    setTimeout(() => {
      setContactSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white p-6 sm:p-8 animate-scale space-y-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. SIZE GUIDE */}
        {activeModal === 'sizeGuide' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit']">Solex Footwear Size Guide</h3>
                <p className="text-xs text-slate-400">Standard international unisex conversions</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-[#18202d] text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="p-3">US Men</th>
                    <th className="p-3">US Women</th>
                    <th className="p-3">UK</th>
                    <th className="p-3">EU</th>
                    <th className="p-3">Foot Length (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr><td className="p-3 font-bold">7.0</td><td className="p-3">8.5</td><td className="p-3">6.0</td><td className="p-3">40.0</td><td className="p-3">25.0 cm</td></tr>
                  <tr><td className="p-3 font-bold">8.0</td><td className="p-3">9.5</td><td className="p-3">7.0</td><td className="p-3">41.0</td><td className="p-3">26.0 cm</td></tr>
                  <tr><td className="p-3 font-bold">8.5</td><td className="p-3">10.0</td><td className="p-3">7.5</td><td className="p-3">42.0</td><td className="p-3">26.5 cm</td></tr>
                  <tr><td className="p-3 font-bold">9.0</td><td className="p-3">10.5</td><td className="p-3">8.0</td><td className="p-3">42.5</td><td className="p-3">27.0 cm</td></tr>
                  <tr><td className="p-3 font-bold">9.5</td><td className="p-3">11.0</td><td className="p-3">8.5</td><td className="p-3">43.0</td><td className="p-3">27.5 cm</td></tr>
                  <tr><td className="p-3 font-bold">10.0</td><td className="p-3">11.5</td><td className="p-3">9.0</td><td className="p-3">44.0</td><td className="p-3">28.0 cm</td></tr>
                  <tr><td className="p-3 font-bold">11.0</td><td className="p-3">12.5</td><td className="p-3">10.0</td><td className="p-3">45.0</td><td className="p-3">29.0 cm</td></tr>
                  <tr><td className="p-3 font-bold">12.0</td><td className="p-3">13.5</td><td className="p-3">11.0</td><td className="p-3">46.0</td><td className="p-3">30.0 cm</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500">
              💡 Tip: If you are between sizes, we recommend ordering half a size up for maximum comfort with thick athletic socks.
            </p>
          </div>
        )}

        {/* 2. SHIPPING INFO */}
        {activeModal === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit']">Shipping & Delivery Information</h3>
                <p className="text-xs text-slate-400">Fast, insured global logistics</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Standard Shipping (3-5 Business Days)</h4>
                <p>FREE on all orders over $100. For orders under $100, flat rate is $12.00.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Express Priority Air (1-2 Business Days)</h4>
                <p>Available at checkout for $25.00 with signature confirmation upon arrival.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Order Tracking</h4>
                <p>You will receive an automated dispatch notification with real-time tracking number as soon as your kicks leave our verified hub.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. RETURNS & EXCHANGES */}
        {activeModal === 'returns' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit']">Hassle-Free 30-Day Returns</h3>
                <p className="text-xs text-slate-400">100% Satisfaction Guarantee</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>We want you to love your kicks. If your shoes don't fit perfectly or you change your mind, return them within 30 days of delivery in unworn, original condition with the box intact.</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>Pre-paid return shipping label generated directly from your account dashboard.</li>
                <li>Refunds processed back to your original payment method within 48 hours of warehouse scan.</li>
                <li>Free size exchanges with priority dispatch for the new replacement pair.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 4. FAQ */}
        {activeModal === 'faq' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit']">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-400">Quick answers to common questions</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">Are all products 100% authentic?</h4>
                <p className="mt-1 text-slate-400">Yes. Every single pair is sourced directly from licensed brand distributors and undergoes multi-point physical verification before entering our inventory.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">How do I track my order?</h4>
                <p className="mt-1 text-slate-400">You can track your order directly in your SOLEX account under the "Order History" tab or via the tracking link in your order confirmation email.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151c27] border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">What promo codes are active?</h4>
                <p className="mt-1 text-slate-400">You can use coupon code <strong className="text-amber-500">SUMMER40</strong> for 40% OFF or <strong className="text-amber-500">SOLEX10</strong> for 10% OFF your entire cart.</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTACT US */}
        {activeModal === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit']">Contact SOLEX Concierge</h3>
                <p className="text-xs text-slate-400">Our customer support specialists are here 24/7</p>
              </div>
            </div>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm">Thank You for Reaching Out!</h4>
                <p className="text-xs text-slate-400">A SOLEX specialist will get back to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jordan Miller"
                    required
                    className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    required
                    className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Message</label>
                  <textarea
                    rows="3"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="How can we help with your order or sizing?"
                    required
                    className="w-full bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-xl cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {/* 6. ABOUT US / TERMS / PRIVACY */}
        {(activeModal === 'about' || activeModal === 'terms' || activeModal === 'privacy') && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit']">
                  {activeModal === 'about' && 'About SOLEX Footwear'}
                  {activeModal === 'terms' && 'Terms & Conditions'}
                  {activeModal === 'privacy' && 'Privacy Policy'}
                </h3>
                <p className="text-xs text-slate-400">Solex Global Commerce Standards</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              {activeModal === 'about' && (
                <>
                  <p>SOLEX was founded with a singular conviction: every step should be a statement of greatness. We curate authentic, grail-worthy performance and lifestyle footwear from the world's most revered athletic brands.</p>
                  <p>From retro hardwood staples to ultramodern marathon runners, our collection bridges heritage culture with cutting-edge comfort.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>By using the SOLEX platform, you agree to our standard customer protection conditions, secure checkout processing rules, and 30-day verified return policies.</p>
                  <p>All trademarks, brand logos (Nike, Adidas, Jordan, Puma, New Balance, Converse, Vans) are property of their respective trademark holders.</p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>We take customer privacy and data security seriously. All transaction data and sensitive information are encrypted using industry-standard 256-bit SSL encryption.</p>
                  <p>We do not sell personal identification or payment credentials to third parties.</p>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
