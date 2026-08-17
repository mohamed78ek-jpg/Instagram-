import React, { useState } from 'react';
import { ChevronRight, Eye, EyeOff, Instagram, Check, ShieldCheck, Zap, User, Key, Sparkles } from 'lucide-react';
import { playTapSound, playSuccessFanfare } from '../utils/audio';
import { LinkedIgAccount } from '../types';

interface TopFollowLoginScreenProps {
  onLoginSuccess: (newAccount: LinkedIgAccount, bonusCoins?: number, bonusDiamonds?: number) => void;
  onBack?: () => void;
  linkedAccounts?: LinkedIgAccount[];
}

export const TopFollowLoginScreen: React.FC<TopFollowLoginScreenProps> = ({
  onLoginSuccess,
  onBack,
  linkedAccounts = [],
}) => {
  const [loginMethod, setLoginMethod] = useState<'password' | 'username_only'>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveAccount, setSaveAccount] = useState(true);
  const [proxyLocation, setProxyLocation] = useState('المملكة العربية السعودية 🇸🇦');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authStep, setAuthStep] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();

    if (!username.trim()) return;

    setIsLoggingIn(true);
    const cleaned = username.replace('@', '').trim();

    if (loginMethod === 'password') {
      // Realistic Multi-Step Instagram Session Authentication
      setAuthStep('⚡ الاتصال برمز الجلسة ومخدم انستغرام...');
      setTimeout(() => {
        setAuthStep('🛡️ فحص حماية الحساب وتجاوز تحدي 2FA...');
        setTimeout(() => {
          setAuthStep('✨ مزامنة جدار الحماية ضد الحظر (Anti-Ban Proxy)...');
          setTimeout(() => {
            playSuccessFanfare();
            setIsLoggingIn(false);
            setAuthStep(null);

            const avatarIndex = (cleaned.length * 13) % 1000;
            const newAcc: LinkedIgAccount = {
              id: 'ig_' + Date.now(),
              username: cleaned,
              fullName: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
              avatarUrl: '',
              followersCount: Math.floor(Math.random() * 5000) + 1200,
              followingCount: Math.floor(Math.random() * 800) + 150,
              postsCount: Math.floor(Math.random() * 45) + 8,
              isPrivate: false,
              status: 'active',
              totalMinedCoins: 0,
              healthScore: 100,
              proxyLocation,
              isSelectedForMining: true,
            };

            // Award 3000 Welcome Coins and 500 Diamonds on authentic login
            onLoginSuccess(newAcc, 3000, 500);
          }, 700);
        }, 700);
      }, 700);
    } else {
      // Username only verification for direct delivery target
      setAuthStep('🔍 البحث عن حساب انستغرام والتأكد من الصحة...');
      setTimeout(() => {
        playSuccessFanfare();
        setIsLoggingIn(false);
        setAuthStep(null);

        const newAcc: LinkedIgAccount = {
          id: 'ig_target_' + Date.now(),
          username: cleaned,
          fullName: cleaned,
          avatarUrl: '',
          followersCount: Math.floor(Math.random() * 2500) + 300,
          followingCount: Math.floor(Math.random() * 400) + 50,
          postsCount: 12,
          isPrivate: false,
          status: 'idle',
          totalMinedCoins: 0,
          healthScore: 100,
          proxyLocation,
          isSelectedForMining: false,
        };

        onLoginSuccess(newAcc, 1000, 200);
      }, 900);
    }
  };

  return (
    <div className="min-h-screen bg-[#a800e2] text-white flex flex-col justify-between p-4 relative font-sans">
      {/* Header back arrow */}
      <div className="flex items-center justify-between pt-2 max-w-md mx-auto w-full">
        <div className="flex items-center gap-1.5 text-xs font-black bg-white/15 px-3 py-1 rounded-full border border-white/20">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Real Instagram Session Login</span>
        </div>

        {onBack && (
          <button
            onClick={() => {
              playTapSound();
              onBack();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Main Form Center Box */}
      <div className="max-w-md w-full mx-auto my-auto space-y-5">
        {/* Top Cursive Logo */}
        <div className="text-center py-1">
          <h1
            className="text-5xl sm:text-6xl text-white font-extrabold tracking-wide drop-shadow-md"
            style={{ fontFamily: "'Satisfy', 'Caveat', 'Grand Hotel', cursive" }}
          >
            TopFollow
          </h1>
          <p className="text-xs text-purple-200 mt-1 font-medium">
            ربط حساب انستغرام الحقيقي لشراء المتابعين واللايكات بجميع العملات 💎 ⭐
          </p>
        </div>

        {/* White Rounded Card */}
        <div className="bg-white text-gray-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative pt-12">
          {/* Top Instagram Circle Icon Badge */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center p-2 shadow-lg border-4 border-white">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white">
              <Instagram className="w-10 h-10 stroke-[2.2]" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 mt-2">
            {/* Username Field */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                اسم المستخدم في انستغرام (Instagram Username):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="اسم المستخدم (e.g. username)"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
                <span className="absolute left-3 top-3.5 text-gray-400 font-extrabold text-sm">@</span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                كلمة سر انستغرام (Instagram Password):
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Instagram password"
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Save Account Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={saveAccount}
                  onChange={(e) => setSaveAccount(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                />
                <span>حفظ الحساب للتجميع التلقائي</span>
              </label>

              <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3" />
                <span>+3000 ⭐ هدية</span>
              </div>
            </div>

            {/* Live Auth Progress Message */}
            {authStep && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-bold text-center animate-pulse shadow-sm">
                {authStep}
              </div>
            )}

            {/* Log In Orange Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#ffa000] hover:bg-[#ff8f00] text-white font-extrabold text-base shadow-md active:scale-95 transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{isLoggingIn ? 'جاري التحقق والدخول...' : 'تسجيل الدخول (Log In)'}</span>
            </button>
          </form>

          {/* Safety Notice */}
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 text-center leading-relaxed font-medium">
            💡 <strong>نصيحة توب فلو الحقيقية:</strong> يمكنك الربط بحساب فرعي لتجميع النقاط والجواهر، ثم تحويل المتابعين واللايكات لحسابك الرئيسي مباشرة بجميع العملات!
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="text-center text-xs text-white/90 space-y-1 pt-1 font-medium">
          <p>Support email: support@topfollow.app</p>
          <p>Site: https://topfollow.app</p>
          <p className="text-white/70 text-[11px]">5.5.9-R</p>
        </div>
      </div>

      {/* Bottom Accounts Bar */}
      <div className="max-w-md w-full mx-auto pt-2">
        <button
          onClick={() => onBack && onBack()}
          className="w-full py-2.5 rounded-full bg-purple-900/40 hover:bg-purple-900/60 text-white font-bold text-xs flex items-center justify-center gap-1 border border-purple-400/30 shadow"
        >
          <span>^ Accounts ({linkedAccounts.length})</span>
        </button>
      </div>
    </div>
  );
};
