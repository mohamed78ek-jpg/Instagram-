import React, { useState } from 'react';
import { AppLanguage, UserAccount } from '../types';
import { Coins, Crown, Sparkles, Zap, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { playSuccessFanfare, playTapSound } from '../utils/audio';

interface CoinStoreVIPProps {
  user: UserAccount;
  language: AppLanguage;
  onAddCoins: (amount: number) => void;
  onUpgradeVip: (level: 'Silver' | 'Gold' | 'VIP Platinum') => void;
}

const COIN_PACKAGES = [
  { id: 'p1', coins: 5000, bonus: 0, price: '$1.99', popular: false, tag: 'Starter' },
  { id: 'p2', coins: 25000, bonus: 5000, price: '$4.99', popular: true, tag: 'Most Popular 🔥' },
  { id: 'p3', coins: 75000, bonus: 20000, price: '$9.99', popular: false, tag: 'Best Value' },
  { id: 'p4', coins: 250000, bonus: 100000, price: '$24.99', popular: false, tag: 'VIP Mega Whale 👑' },
];

export const CoinStoreVIP: React.FC<CoinStoreVIPProps> = ({
  user,
  language,
  onAddCoins,
  onUpgradeVip,
}) => {
  const [purchasedMsg, setPurchasedMsg] = useState<string | null>(null);

  const handleBuyPackage = (pkg: typeof COIN_PACKAGES[0]) => {
    playTapSound();
    const totalCoins = pkg.coins + pkg.bonus;
    onAddCoins(totalCoins);

    if (pkg.id === 'p4') {
      onUpgradeVip('VIP Platinum');
    } else if (pkg.id === 'p2' || pkg.id === 'p3') {
      onUpgradeVip('Gold');
    }

    playSuccessFanfare();
    setPurchasedMsg(
      language === 'ar'
        ? `تم شراء الباقة بنجاح! تم إضافة +${totalCoins.toLocaleString()} نقطة إلى حسابك فورا 🚀`
        : `Package purchased successfully! +${totalCoins.toLocaleString()} coins credited to your account 🚀`
    );

    setTimeout(() => setPurchasedMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner VIP Status */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Crown className="w-6 h-6 text-pink-500 fill-pink-500" />
              <h2 className="text-xl font-black text-white">
                {language === 'ar' ? 'عضوية توب فلو الفاخرة VIP' : 'TopFollow VIP Membership'}
              </h2>
            </div>
            <p className="text-xs text-gray-400">
              {language === 'ar'
                ? 'احصل على سرعة تجميع مضاعفة 2X وأولوية فائقة في تنفيذ طلبات المتابعين'
                : 'Get 2X Mining speed and high priority follower order delivery'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{language === 'ar' ? `مستواك الحالي: ${user.vipLevel}` : `Current Level: ${user.vipLevel}`}</span>
          </div>
        </div>
      </div>

      {purchasedMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-sm font-bold flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{purchasedMsg}</span>
        </div>
      )}

      {/* Coin Store Packages Grid */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <span>{language === 'ar' ? 'باقات النقاط الفورية' : 'Instant Coin Packages'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COIN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all ${
                pkg.popular
                  ? 'bg-[#141414] border-pink-500 shadow-xl shadow-pink-600/20 ring-1 ring-pink-500/30'
                  : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow">
                  {pkg.tag}
                </span>

                <div className="text-3xl font-black text-white pt-1">
                  +{pkg.coins.toLocaleString()}
                </div>

                {pkg.bonus > 0 && (
                  <div className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>+{pkg.bonus.toLocaleString()} {language === 'ar' ? 'نقطة إضافية مجاناً' : 'Bonus Coins'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-xl font-extrabold text-amber-400">{pkg.price}</div>

                <button
                  onClick={() => handleBuyPackage(pkg)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-black text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>{language === 'ar' ? 'شراء فوري' : 'BUY NOW'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perks List */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {language === 'ar' ? 'مميزات شحن رصيد توب فلو:' : 'TopFollow Coin Perks:'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#050505] border border-white/5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{language === 'ar' ? 'شحن فوري للنقاط بدون انتظار' : 'Instant credit without delay'}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#050505] border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{language === 'ar' ? 'ضمان عدم نقصان المتابعين 100%' : '100% Non-drop guarantee'}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#050505] border border-white/5">
            <Crown className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{language === 'ar' ? 'شارة العضو الفخم والمميز VIP' : 'VIP Badge & priority support'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
