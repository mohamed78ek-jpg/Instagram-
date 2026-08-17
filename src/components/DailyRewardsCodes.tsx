import React, { useState, useRef } from 'react';
import { AppLanguage, UserAccount, PromoCode } from '../types';
import { Gift, Calendar, Sparkles, Copy, Check, Dices, Trophy, Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { playCoinSound, playSpinTickSound, playSuccessFanfare, playTapSound } from '../utils/audio';

interface DailyRewardsCodesProps {
  user: UserAccount;
  promoCodes: PromoCode[];
  language: AppLanguage;
  onAddCoins: (amount: number) => void;
  onRedeemPromoCode: (code: string) => void;
  onUpdateDailyStreak: () => void;
}

const WHEEL_SECTORS = [
  { label: '+50 Coins', value: 50, color: '#9333ea' },
  { label: '+100 Coins', value: 100, color: '#ec4899' },
  { label: '+200 Coins', value: 200, color: '#eab308' },
  { label: '+500 Coins', value: 500, color: '#10b981' },
  { label: '+10 Coins', value: 10, color: '#6366f1' },
  { label: 'JACKPOT 1,000', value: 1000, color: '#f59e0b' },
  { label: '+150 Coins', value: 150, color: '#8b5cf6' },
  { label: '+300 Coins', value: 300, color: '#06b6d4' },
];

export const DailyRewardsCodes: React.FC<DailyRewardsCodesProps> = ({
  user,
  promoCodes,
  language,
  onAddCoins,
  onRedeemPromoCode,
  onUpdateDailyStreak,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemFeedback, setRedeemFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [canSpinToday, setCanSpinToday] = useState(true);

  // Daily Check-in claim state
  const [claimedToday, setClaimedToday] = useState(false);

  const streakDays = [
    { day: 1, coins: 50 },
    { day: 2, coins: 100 },
    { day: 3, coins: 150 },
    { day: 4, coins: 250 },
    { day: 5, coins: 400 },
    { day: 6, coins: 600 },
    { day: 7, coins: 1000, special: 'VIP Badge' },
  ];

  const handleClaimDaily = () => {
    playTapSound();
    if (claimedToday) return;

    const currentStreakDay = ((user.dailyStreak) % 7) + 1;
    const reward = streakDays.find((s) => s.day === currentStreakDay)?.coins || 100;

    onAddCoins(reward);
    playSuccessFanfare();
    onUpdateDailyStreak();
    setClaimedToday(true);
  };

  const handleRedeemCode = (e?: React.FormEvent, codeToUse?: string) => {
    if (e) e.preventDefault();
    playTapSound();
    setRedeemFeedback(null);

    const codeStr = (codeToUse || inputCode).trim().toUpperCase();
    if (!codeStr) return;

    const target = promoCodes.find((p) => p.code.toUpperCase() === codeStr);

    if (!target) {
      setRedeemFeedback({
        type: 'error',
        msg: language === 'ar' ? 'الكود غير صحيح أو منتهي الصلاحية!' : 'Invalid or expired promo code!',
      });
      return;
    }

    if (target.isRedeemed) {
      setRedeemFeedback({
        type: 'error',
        msg: language === 'ar' ? 'تم استخدام هذا الكود سابقاً على هذا الحساب!' : 'You have already redeemed this promo code!',
      });
      return;
    }

    // Success redemption
    onAddCoins(target.coinsReward);
    onRedeemPromoCode(target.code);
    playSuccessFanfare();

    setRedeemFeedback({
      type: 'success',
      msg:
        language === 'ar'
          ? `مبروك! تم شحن +${target.coinsReward.toLocaleString()} نقطة مجاناً بحسابك!`
          : `Congratulations! +${target.coinsReward.toLocaleString()} coins added to your account!`,
    });

    setInputCode('');
  };

  const handleCopyCode = (code: string) => {
    playTapSound();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Wheel Spin Logic
  const handleSpinWheel = () => {
    if (isSpinning || !canSpinToday) return;

    playTapSound();
    setIsSpinning(true);
    setWonPrize(null);

    // Calculate random sector
    const winningIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const sectorAngle = 360 / WHEEL_SECTORS.length;
    const extraRounds = 5 * 360; // 5 full turns
    const targetDegrees = extraRounds + (360 - winningIndex * sectorAngle - sectorAngle / 2);

    setWheelRotation((prev) => prev + targetDegrees);

    // Tick audio
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playSpinTickSound();
      tickCount++;
      if (tickCount > 20) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      setIsSpinning(false);
      setCanSpinToday(false);
      const prize = WHEEL_SECTORS[winningIndex];

      onAddCoins(prize.value);
      playSuccessFanfare();
      setWonPrize(
        language === 'ar'
          ? `ربحت ${prize.label} من عجلة الحظ!`
          : `You won ${prize.label} on the Lucky Wheel!`
      );
    }, 3800);
  };

  return (
    <div className="space-y-6">
      {/* Promo Code Input Card */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-pink-500" />
          <h2 className="text-base font-bold text-white">
            {language === 'ar' ? 'إدخال كودات توب فلو المخصصة' : 'Redeem TopFollow Promo Codes'}
          </h2>
        </div>

        <form onSubmit={(e) => handleRedeemCode(e)} className="flex gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={language === 'ar' ? 'ادخل الكود هنا (مثال: TOP2026)' : 'Enter code (e.g. TOP2026)'}
            className="flex-1 px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-500 font-mono text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-black text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current text-white" />
            <span>{language === 'ar' ? 'تفعيل الكود' : 'REDEEM'}</span>
          </button>
        </form>

        {/* Feedback Alert */}
        {redeemFeedback && (
          <div
            className={`mt-3 p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              redeemFeedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-red-950/80 border-red-800 text-red-200'
            }`}
          >
            {redeemFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{redeemFeedback.msg}</span>
          </div>
        )}

        {/* Active Codes Quick List */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <span className="text-xs text-gray-400 font-bold block mb-2">
            {language === 'ar' ? '💡 كودات مجانية جاهزة للتفعيل بنقرة واحدة:' : '💡 Official Working Codes:'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {promoCodes.map((p) => (
              <div
                key={p.code}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  p.isRedeemed
                    ? 'bg-[#050505]/40 border-white/5 opacity-50'
                    : 'bg-[#050505] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <span className="font-mono font-bold text-amber-400 mr-2">{p.code}</span>
                  <span className="text-[11px] text-gray-400">
                    (+{p.coinsReward.toLocaleString()} {language === 'ar' ? 'نقطة' : 'coins'})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {p.isRedeemed ? (
                    <span className="text-[10px] text-gray-500 font-semibold">
                      {language === 'ar' ? 'مستعمل' : 'Redeemed'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRedeemCode(undefined, p.code)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#dc2743] to-[#cc2366] text-white font-bold text-[10px] transition-colors"
                    >
                      {language === 'ar' ? 'تفعيل الآن' : 'Redeem'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Check-In Streak Roadmap */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            <h2 className="text-base font-bold text-white">
              {language === 'ar' ? 'المكافآت اليومية المتتالية (Streak)' : '7-Day Check-in Streak'}
            </h2>
          </div>

          <span className="text-xs text-pink-400 font-bold bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full">
            {language === 'ar' ? `سلسلتك الحالية: ${user.dailyStreak} أيام` : `Current Streak: ${user.dailyStreak} days`}
          </span>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {streakDays.map((s) => {
            const isCompleted = user.dailyStreak >= s.day;
            const isCurrent = user.dailyStreak + 1 === s.day;

            return (
              <div
                key={s.day}
                className={`rounded-xl p-3 border text-center flex flex-col items-center justify-between gap-1 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-[#141414] border-pink-500 text-white shadow-lg ring-1 ring-pink-500/30'
                    : 'bg-[#050505] border-white/5 text-gray-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {language === 'ar' ? `اليوم ${s.day}` : `Day ${s.day}`}
                </span>

                <div className="font-extrabold text-sm text-white">+{s.coins}</div>

                {s.special && (
                  <span className="text-[9px] text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.2 rounded">
                    👑 VIP
                  </span>
                )}

                {isCompleted ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="text-[9px] font-black text-pink-400 animate-pulse">
                    {language === 'ar' ? 'جاهز' : 'READY'}
                  </span>
                ) : (
                  <span className="text-[9px] text-gray-600">🔒</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClaimDaily}
          disabled={claimedToday}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
            claimedToday
              ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-[#dc2743] to-[#cc2366] text-white active:scale-95 shadow-lg shadow-pink-600/30'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>
            {claimedToday
              ? language === 'ar'
                ? 'تم استلام مكافأة اليوم (عد غداً للمزيد)'
                : 'Already claimed today (Come back tomorrow)'
              : language === 'ar'
              ? 'استلام مكافأة اليوم الفورية 🎁'
              : 'Claim Today Reward 🎁'}
          </span>
        </button>
      </div>

      {/* Interactive Spin Wheel */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Dices className="w-5 h-5 text-amber-400 animate-spin" />
          <h2 className="text-base font-bold text-white">
            {language === 'ar' ? 'عجلة الحظ اليومية لربح النقاط' : 'Daily Lucky Spin Wheel'}
          </h2>
        </div>

        {/* Visual Rotational Wheel */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          {/* Wheel Pointer Pin */}
          <div className="absolute -top-3 z-20 w-6 h-6 text-pink-500 drop-shadow-md">
            ▼
          </div>

          <div
            className="w-full h-full rounded-full border-4 border-pink-500/50 shadow-2xl overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transitionDuration: isSpinning ? '3.8s' : '0s',
            }}
          >
            <div className="w-full h-full relative">
              {WHEEL_SECTORS.map((sec, idx) => {
                const angle = (360 / WHEEL_SECTORS.length) * idx;
                return (
                  <div
                    key={idx}
                    className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-end pr-3 border border-black/20"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      backgroundColor: sec.color,
                    }}
                  >
                    <span className="text-[10px] font-black text-white uppercase rotate-90 tracking-tighter">
                      {sec.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wheel Center Button */}
          <button
            onClick={handleSpinWheel}
            disabled={isSpinning || !canSpinToday}
            className={`absolute z-10 w-16 h-16 rounded-full bg-[#050505] border-2 border-pink-500 text-pink-400 font-black text-xs shadow-xl flex items-center justify-center ${
              isSpinning ? 'opacity-80 cursor-wait' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {isSpinning ? 'SPINNING' : 'SPIN'}
          </button>
        </div>

        {wonPrize && (
          <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-extrabold text-sm animate-bounce">
            🎉 {wonPrize}
          </div>
        )}

        <p className="text-xs text-gray-400">
          {language === 'ar'
            ? 'فرصة واحدة مجانية يومياً لجميع مستخدمي توب فلو'
            : '1 Free Spin available daily for all TopFollow users'}
        </p>
      </div>
    </div>
  );
};
