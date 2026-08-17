import React, { useState } from 'react';
import { UserAccount, PromoCode } from '../types';
import { Gift, Tag, Ticket, Check, Copy, Sparkles, ChevronRight } from 'lucide-react';
import { playTapSound, playSuccessFanfare, playCoinSound } from '../utils/audio';

interface TopFollowMoreTabProps {
  user: UserAccount;
  promoCodes: PromoCode[];
  onAddCoins: (amount: number) => void;
  onRedeemPromoCode: (code: string) => boolean;
  onOpenStore: () => void;
}

export const TopFollowMoreTab: React.FC<TopFollowMoreTabProps> = ({
  user,
  promoCodes,
  onAddCoins,
  onRedeemPromoCode,
  onOpenStore,
}) => {
  const [activeModal, setActiveModal] = useState<'daily' | 'codes' | 'coupons' | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Daily Bonus Check-in
  const handleDailyCheckIn = () => {
    playTapSound();
    onAddCoins(100);
    playCoinSound();
    playSuccessFanfare();
    setFeedbackMsg('تم الحصول على +100 نقطة هدية اليوم! 🎉');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // Redeem Promo Code
  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    playTapSound();

    const success = onRedeemPromoCode(inputCode.trim());
    if (success) {
      playSuccessFanfare();
      setFeedbackMsg(`تم تفعيل الكود (${inputCode}) وإضافة النقاط لرصيدك! 🔥`);
      setInputCode('');
    } else {
      setFeedbackMsg('الكود غير صحيح أو مستخدم سابقاً!');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-3 pb-24 font-sans text-gray-800">
      {/* Top Orange Header Button: Buy Followers & Likes */}
      <div className="bg-white rounded-2xl p-3.5 shadow-md border border-gray-100">
        <button
          onClick={() => {
            playTapSound();
            onOpenStore();
          }}
          className="w-full py-3.5 rounded-xl bg-[#ffa000] hover:bg-[#ff8f00] text-white font-extrabold text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Buy Followers & Likes</span>
        </button>
      </div>

      {/* Options Cards List */}
      <div className="space-y-3">
        {/* Daily Bonus Card */}
        <button
          onClick={() => {
            playTapSound();
            setActiveModal('daily');
          }}
          className="w-full bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Gift className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Daily bonus</h3>
              <p className="text-xs text-gray-500">احصل على نقاط مجانية يومياً بمجرد الدخول</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Codes Card */}
        <button
          onClick={() => {
            playTapSound();
            setActiveModal('codes');
          }}
          className="w-full bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
              <Tag className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Codes</h3>
              <p className="text-xs text-gray-500">أدخل أكواد الخصم والهدايا لتجميع الذهب</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Coupons Card */}
        <button
          onClick={() => {
            playTapSound();
            setActiveModal('coupons');
          }}
          className="w-full bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Ticket className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Coupons</h3>
              <p className="text-xs text-gray-500">إنشاء واستبدال كوبونات تحويل النقاط للأصدقاء</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Modal Dialog for Daily Bonus / Codes / Coupons */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            {activeModal === 'daily' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">المكافأة اليومية (Daily Bonus)</h3>
                <p className="text-xs text-gray-600">اضغط للحصول على 100 نقطة مجانية يومياً!</p>
                <button
                  onClick={handleDailyCheckIn}
                  className="w-full py-3.5 rounded-xl bg-[#ffa000] hover:bg-[#ff8f00] text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
                >
                  استلام المكافأة (+100 ⭐)
                </button>
              </div>
            )}

            {activeModal === 'codes' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 text-center">أكواد توب فلو المجانية (Codes)</h3>

                <form onSubmit={handleRedeemCode} className="space-y-3">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter code (e.g. TOP2026)"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#ffa000] hover:bg-[#ff8f00] text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
                  >
                    تفعيل الكود (Send)
                  </button>
                </form>

                <div className="pt-2">
                  <span className="text-xs font-bold text-gray-500 block mb-2">أكواد سريعة متاحة:</span>
                  <div className="flex flex-wrap gap-2">
                    {['TOP2026', 'ARAB2026', 'FREE500', 'VIPBOOST'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setInputCode(c);
                          playTapSound();
                        }}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-extrabold rounded-lg border border-purple-200"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'coupons' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg">
                  <Ticket className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">الكوبونات (Coupons)</h3>
                <p className="text-xs text-gray-600">يمكنك إنشاء كود كوبون هدية تحول فيه نقاطك لصديق مباشرة!</p>
                <div className="p-3 bg-gray-50 rounded-2xl border text-xs text-gray-700 font-bold">
                  كود الاحالة الخاص بك: <span className="text-purple-600">{user.refCode || 'TOP-89234'}</span>
                </div>
              </div>
            )}

            {feedbackMsg && (
              <div className="p-3 bg-purple-50 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold text-center">
                {feedbackMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
