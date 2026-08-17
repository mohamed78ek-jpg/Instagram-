import React, { useState } from 'react';
import { UserAccount, Order } from '../types';
import { User, CheckCircle2, Zap, Sparkles, UserPlus } from 'lucide-react';
import { playTapSound, playSuccessFanfare } from '../utils/audio';

interface TopFollowFollowersTabProps {
  user: UserAccount;
  targetUsername: string;
  onDeductCoins: (amount: number) => boolean;
  onDeductDiamonds: (amount: number) => boolean;
  onCreateOrder: (order: Order) => void;
  onOpenStore: () => void;
  onChangeTargetUsername?: () => void;
}

const FOLLOWER_PACKAGES = [
  { count: 100, coinCost: 800, diamondCost: 100 },
  { count: 200, coinCost: 1600, diamondCost: 200 },
  { count: 500, coinCost: 4000, diamondCost: 500 },
  { count: 1000, coinCost: 8000, diamondCost: 1000 },
  { count: 2000, coinCost: 16000, diamondCost: 2000 },
  { count: 5000, coinCost: 40000, diamondCost: 5000 },
  { count: 10000, coinCost: 80000, diamondCost: 10000 },
];

export const TopFollowFollowersTab: React.FC<TopFollowFollowersTabProps> = ({
  user,
  targetUsername,
  onDeductCoins,
  onDeductDiamonds,
  onCreateOrder,
  onOpenStore,
  onChangeTargetUsername,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'coins' | 'diamonds'>('coins');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBuyPackage = (count: number, coinCost: number, diamondCost: number) => {
    playTapSound();
    setSuccessMsg(null);

    if (selectedCurrency === 'coins') {
      if (user.coins < coinCost) {
        setSuccessMsg(`رصيد الذهب غير كافٍ! تحتاج إلى ${coinCost} ⭐. قم بالتجميع أو التحويل للجواهر.`);
        return;
      }
      const success = onDeductCoins(coinCost);
      if (!success) return;
    } else {
      if ((user.diamonds || 0) < diamondCost) {
        setSuccessMsg(`رصيد الجواهر غير كافٍ! تحتاج إلى ${diamondCost} 💎.`);
        return;
      }
      const success = onDeductDiamonds(diamondCost);
      if (!success) return;
    }

    playSuccessFanfare();

    onCreateOrder({
      id: 'ord_fol_' + Date.now(),
      type: 'followers',
      targetUsername,
      totalQuantity: count,
      deliveredQuantity: 0,
      costInCoins: selectedCurrency === 'coins' ? coinCost : diamondCost,
      status: 'active',
      createdAt: new Date().toISOString(),
      estimatedDeliverySpeed: 'turbo',
    });

    setSuccessMsg(
      `تم إرسال طلب ${count.toLocaleString()} متابع إلى الحساب الرسمي @${targetUsername} بنجاح! 🎉`
    );
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="max-w-md mx-auto space-y-3 pb-24 font-sans text-gray-800">
      {/* Target Account Badge Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold">الحساب المستلم للمتابعين:</div>
            <div className="text-xs font-black text-purple-900">
              {targetUsername ? `@${targetUsername}` : 'لم يتم إدخال حساب (اضغط للربط)'}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            playTapSound();
            onChangeTargetUsername && onChangeTargetUsername();
          }}
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs border border-purple-200 transition-colors"
        >
          تغيير الحساب
        </button>
      </div>

      {/* Currency Selection Toggle */}
      <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            playTapSound();
            setSelectedCurrency('coins');
          }}
          className={`py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            selectedCurrency === 'coins'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>الشراء بالذهب (⭐)</span>
          <span className="text-[11px] opacity-90">({user.coins.toLocaleString()})</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setSelectedCurrency('diamonds');
          }}
          className={`py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            selectedCurrency === 'diamonds'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>الشراء بالجواهر (💎)</span>
          <span className="text-[11px] opacity-90">({user.diamonds || 400})</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {successMsg && (
        <div className="p-3 bg-purple-100 text-purple-900 border border-purple-200 rounded-2xl text-xs text-center font-bold shadow-sm">
          {successMsg}
        </div>
      )}

      {/* Follower Packages List */}
      <div className="bg-white rounded-2xl p-2.5 shadow-md border border-gray-100 space-y-2">
        {FOLLOWER_PACKAGES.map((pkg) => {
          const cost = selectedCurrency === 'coins' ? pkg.coinCost : pkg.diamondCost;

          return (
            <div
              key={pkg.count}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors border border-gray-100"
            >
              {/* Left Side: Get Yellow Button */}
              <button
                onClick={() => handleBuyPackage(pkg.count, pkg.coinCost, pkg.diamondCost)}
                className={`px-5 py-2 rounded-xl text-gray-900 font-extrabold text-xs shadow-sm transition-transform active:scale-95 ${
                  selectedCurrency === 'coins'
                    ? 'bg-[#ffb300] hover:bg-[#ffa000]'
                    : 'bg-cyan-400 hover:bg-cyan-500 text-gray-900'
                }`}
              >
                Get
              </button>

              {/* Middle: Coin Cost Badge */}
              <div className="flex items-center gap-1 font-black text-gray-900 text-sm">
                <span>{cost.toLocaleString()}</span>
                <span className="text-sm">
                  {selectedCurrency === 'coins' ? '⭐' : '💎'}
                </span>
              </div>

              {/* Right Side: Followers Count */}
              <div className="flex items-center gap-1.5 font-black text-gray-900 text-sm">
                <span>{pkg.count.toLocaleString()}</span>
                <User className="w-4 h-4 text-purple-600 fill-purple-600" />
                <span className="text-purple-600 font-extrabold text-xs">+</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
