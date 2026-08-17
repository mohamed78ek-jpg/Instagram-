import React, { useState } from 'react';
import { AppLanguage, UserAccount, Order } from '../types';
import { Users, Search, CheckCircle2, Sparkles, AlertCircle, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { playSuccessFanfare, playTapSound } from '../utils/audio';

interface GetFollowersProps {
  user: UserAccount;
  language: AppLanguage;
  onDeductCoins: (amount: number) => boolean;
  onCreateOrder: (order: Order) => void;
  onOpenStore: () => void;
}

const FOLLOWER_PACKAGES = [
  { count: 10, cost: 80, popular: false, bonus: '' },
  { count: 50, cost: 400, popular: false, bonus: '' },
  { count: 100, cost: 800, popular: true, bonus: '+10 Free Likes' },
  { count: 500, cost: 4000, popular: true, bonus: '+50 Free Likes' },
  { count: 1000, cost: 8000, popular: false, bonus: '+100 Free Likes + VIP Tag' },
  { count: 5000, cost: 40000, popular: false, bonus: '+500 Free Likes + Turbo Speed' },
];

export const GetFollowers: React.FC<GetFollowersProps> = ({
  user,
  language,
  onDeductCoins,
  onCreateOrder,
  onOpenStore,
}) => {
  const [targetUsername, setTargetUsername] = useState('');
  const [searchedProfile, setSearchedProfile] = useState<{
    username: string;
    avatarUrl: string;
    followers: number;
    posts: number;
    isVerified: boolean;
  }>({
    username: 'instagram_user',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    followers: 2450,
    posts: 38,
    isVerified: true,
  });

  const [selectedPackage, setSelectedPackage] = useState<number>(100);
  const [customCount, setCustomCount] = useState<number>(100);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'turbo'>('turbo');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateCost = (count: number) => count * 8; // 8 coins per follower

  const activeQuantity = isCustom ? customCount : selectedPackage;
  const activeCost = calculateCost(activeQuantity);

  const handleSearchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    if (!targetUsername.trim()) return;

    // Simulate Instagram profile lookup
    const cleaned = targetUsername.replace('@', '').trim();
    setSearchedProfile({
      username: cleaned,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (cleaned.length * 9999) % 1000000}?w=150&auto=format&fit=crop&q=80`,
      followers: 1200 + cleaned.length * 140,
      posts: 12 + cleaned.length * 2,
      isVerified: cleaned.length > 8,
    });
  };

  const handleConfirmOrder = () => {
    playTapSound();
    setErrorMsg(null);
    setOrderSuccessMsg(null);

    if (user.coins < activeCost) {
      setErrorMsg(
        language === 'ar'
          ? `رصيدك غير كافٍ! تحتاج إلى ${activeCost.toLocaleString()} نقطة (رصيدك الحالي: ${user.coins.toLocaleString()} نقطة)`
          : `Insufficient coins! Required: ${activeCost.toLocaleString()} coins (Your balance: ${user.coins.toLocaleString()})`
      );
      return;
    }

    const success = onDeductCoins(activeCost);
    if (!success) return;

    playSuccessFanfare();

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      type: 'followers',
      targetUsername: searchedProfile.username,
      totalQuantity: activeQuantity,
      deliveredQuantity: 0,
      costInCoins: activeCost,
      status: 'active',
      createdAt: new Date().toISOString(),
      estimatedDeliverySpeed: deliverySpeed,
    };

    onCreateOrder(newOrder);

    setOrderSuccessMsg(
      language === 'ar'
        ? `تم إرسال الطلب بنجاح! جاري إرسال ${activeQuantity} متابع إلى @${searchedProfile.username}`
        : `Order placed successfully! Sending ${activeQuantity} followers to @${searchedProfile.username}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Target Username Search Header */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-xl">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-pink-500" />
          <span>{language === 'ar' ? 'حدد الحساب المستهدف لإرسال المتابعين' : 'Target Instagram Account'}</span>
        </h2>

        <form onSubmit={handleSearchProfile} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-pink-500 font-bold text-sm">
              @
            </span>
            <input
              type="text"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder="اسم المستخدم (e.g. username)"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 border border-white/10"
          >
            <Search className="w-4 h-4 text-pink-400" />
            <span>{language === 'ar' ? 'بحث معاينة' : 'Search'}</span>
          </button>
        </form>

        {/* Search Result Profile Preview Card */}
        {searchedProfile && (
          <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={searchedProfile.avatarUrl}
                alt={searchedProfile.username}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500/50"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span>@{searchedProfile.username}</span>
                  {searchedProfile.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                  <span>{searchedProfile.followers.toLocaleString()} {language === 'ar' ? 'متابع حالي' : 'followers'}</span>
                  <span>•</span>
                  <span>{searchedProfile.posts} {language === 'ar' ? 'منشور' : 'posts'}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                {language === 'ar' ? 'جاهز للاستلام' : 'Ready'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Package Selection Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'اختر باقة المتابعين المناسبة' : 'Choose Follower Package'}</span>
          </h3>

          <button
            onClick={() => {
              playTapSound();
              setIsCustom(!isCustom);
            }}
            className="text-xs text-pink-400 hover:underline font-semibold"
          >
            {isCustom
              ? language === 'ar'
                ? 'رجوع للباقات المجهزة'
                : 'Back to Fixed Packages'
              : language === 'ar'
              ? 'تخصيص كمية محددة بالعداد ⚙️'
              : 'Custom Quantity Slider ⚙️'}
          </button>
        </div>

        {!isCustom ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FOLLOWER_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.count;
              return (
                <div
                  key={pkg.count}
                  onClick={() => {
                    playTapSound();
                    setSelectedPackage(pkg.count);
                  }}
                  className={`relative cursor-pointer rounded-2xl p-4 border transition-all ${
                    isSelected
                      ? 'bg-[#141414] border-pink-500 shadow-xl shadow-pink-600/20 ring-1 ring-pink-500/30'
                      : 'bg-[#0e0e0e] border-white/10 hover:border-white/20 hover:bg-[#121212]'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow">
                      {language === 'ar' ? 'الأكثر طلباً 🔥' : 'BEST VALUE'}
                    </span>
                  )}

                  <div className="text-center space-y-1">
                    <div className="text-2xl font-black text-white">
                      +{pkg.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {language === 'ar' ? 'متابع انستغرام' : 'Instagram Followers'}
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-1 text-amber-400 font-extrabold text-sm">
                      <span>{pkg.cost.toLocaleString()}</span>
                      <span className="text-[10px] text-amber-500/80">{language === 'ar' ? 'نقطة' : 'coins'}</span>
                    </div>

                    {pkg.bonus && (
                      <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                        🎁 {pkg.bonus}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Quantity Slider */
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 font-bold">
                {language === 'ar' ? 'اختر الكمية بالضبط:' : 'Custom Follower Amount:'}
              </span>
              <span className="text-2xl font-black text-amber-400">
                +{customCount.toLocaleString()} {language === 'ar' ? 'متابع' : 'followers'}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="10000"
              step="10"
              value={customCount}
              onChange={(e) => setCustomCount(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-[#050505] rounded-lg"
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>10</span>
              <span>2,500</span>
              <span>5,000</span>
              <span>10,000</span>
            </div>
          </div>
        )}
      </div>

      {/* Speed & Order Execution Card */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div>
            <span className="text-xs text-gray-400">{language === 'ar' ? 'سرعة إرسال المتابعين:' : 'Delivery Speed:'}</span>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setDeliverySpeed('turbo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  deliverySpeed === 'turbo'
                    ? 'bg-pink-500/10 border-pink-500/50 text-pink-400'
                    : 'bg-white/5 border-white/5 text-gray-400'
                }`}
              >
                ⚡ {language === 'ar' ? 'إرسال سريع توربو' : 'Turbo Delivery'}
              </button>
              <button
                onClick={() => setDeliverySpeed('standard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  deliverySpeed === 'standard'
                    ? 'bg-pink-500/10 border-pink-500/50 text-pink-400'
                    : 'bg-white/5 border-white/5 text-gray-400'
                }`}
              >
                🌿 {language === 'ar' ? 'إرسال تدريجي طبيعي' : 'Gradual Delivery'}
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400">{language === 'ar' ? 'التكلفة الإجمالية:' : 'Total Cost:'}</span>
            <div className="text-2xl font-black text-amber-400">
              {activeCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-amber-500/80">{language === 'ar' ? 'نقطة' : 'coins'}</span>
            </div>
          </div>
        </div>

        {/* Error / Success Feedback Banners */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
            <button
              onClick={onOpenStore}
              className="px-2.5 py-1 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300 transition-colors"
            >
              {language === 'ar' ? 'شراء نقاط' : 'Buy Coins'}
            </button>
          </div>
        )}

        {orderSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={handleConfirmOrder}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-black text-base tracking-wide shadow-2xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Zap className="w-5 h-5 fill-current text-white" />
          <span>
            {language === 'ar'
              ? `تأكيد إرسال ${activeQuantity.toLocaleString()} متابع (${activeCost.toLocaleString()} نقطة)`
              : `Confirm ${activeQuantity.toLocaleString()} Followers (${activeCost.toLocaleString()} Coins)`}
          </span>
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {language === 'ar'
              ? 'متابعين حقيقيين 100% بدون حاجة لكلمة السر مع ضمان عدم النقصان'
              : '100% Real followers without password requirements'}
          </span>
        </div>
      </div>
    </div>
  );
};
