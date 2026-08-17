import React, { useState } from 'react';
import { AppLanguage, LinkedIgAccount } from '../types';
import { X, UserPlus, ShieldCheck, Check, Instagram, Sparkles, Trash2, Key, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { playTapSound, playCoinSound } from '../utils/audio';

interface LinkedAccountsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedAccounts: LinkedIgAccount[];
  activeAccountId: string;
  onSelectAccount: (id: string) => void;
  onAddAccount: (acc: LinkedIgAccount) => void;
  onDeleteAccount: (id: string) => void;
  language: AppLanguage;
}

export const LinkedAccountsManagerModal: React.FC<LinkedAccountsManagerModalProps> = ({
  isOpen,
  onClose,
  linkedAccounts,
  activeAccountId,
  onSelectAccount,
  onAddAccount,
  onDeleteAccount,
  language,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [proxyRegion, setProxyRegion] = useState('المملكة العربية السعودية 🇸🇦');
  const [loginStep, setLoginStep] = useState<number>(0); // 0 = idle, 1..4 = steps, 5 = done
  const [loginStatusText, setLoginStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setErrorMsg('');

    if (!newUsername.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال اسم المستخدم للانستغرام' : 'Please enter Instagram username');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال كلمة السر الخاصة بحساب الانستغرام' : 'Please enter valid Instagram password');
      return;
    }

    const cleaned = newUsername.replace('@', '').trim();

    // Start Instagram login simulation steps
    setLoginStep(1);
    setLoginStatusText(language === 'ar' ? 'جارِ الاتصال بخوادم انستغرام الرسمية (api.instagram.com)...' : 'Connecting to official Instagram API...');

    setTimeout(() => {
      setLoginStep(2);
      setLoginStatusText(language === 'ar' ? `تفعيل خادم البروكسي الحامي من الحظر (${proxyRegion})...` : 'Applying Anti-Ban Proxy Safeguard...');
    }, 900);

    setTimeout(() => {
      setLoginStep(3);
      setLoginStatusText(language === 'ar' ? 'التحقق من صحة بيانات الجلسة وتخطي التحدي الحمايتي...' : 'Verifying session token & bypassing checkpoint...');
    }, 1800);

    setTimeout(() => {
      setLoginStep(4);
      setLoginStatusText(language === 'ar' ? 'تم تسجيل الدخول بنجاح! إضافة الحساب لمحرك تجميع العملات...' : 'Login Successful! Added to mining pool...');
      playCoinSound();
    }, 2700);

    setTimeout(() => {
      const newAcc: LinkedIgAccount = {
        id: 'acc_' + Date.now(),
        username: cleaned,
        fullName: cleaned,
        avatarUrl: `https://images.unsplash.com/photo-${1510000000000 + (cleaned.length * 8888) % 1000000}?w=150&auto=format&fit=crop&q=80`,
        followersCount: Math.floor(Math.random() * 800) + 120,
        followingCount: Math.floor(Math.random() * 400) + 50,
        postsCount: Math.floor(Math.random() * 20) + 2,
        isPrivate: false,
        status: 'active',
        totalMinedCoins: 50,
        healthScore: 100,
        proxyLocation: proxyRegion,
      };

      onAddAccount(newAcc);
      setNewUsername('');
      setPassword('');
      setLoginStep(0);
      setIsAdding(false);
    }, 3400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-md">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'تسجيل دخول انستغرام (توب فلو)' : 'TopFollow Instagram Login'}</span>
              </h3>
              <p className="text-[10px] text-gray-400">
                {language === 'ar' ? 'قم بربط حسابات الانستغرام لتجميع العملات تلقائياً' : 'Connect Instagram accounts to mine coins automatically'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TopFollow Golden Rule / Strategy Tip Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-transparent border border-pink-500/20 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{language === 'ar' ? '💡 نصيحة توب فلو الذهبية لجمع العملات:' : '💡 TopFollow Smart Mining Strategy:'}</span>
          </div>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            {language === 'ar'
              ? 'قم بتسجيل الدخول بحساب انستغرام فرعي أو وهمي (Fake Account) لتجميع النقاط والعملات آلياً. بعد تجميع العملات يمكنك إرسال المتابعين واللايكات لحسابك الأساسي دون الحاجة لكلمة سر حسابك الرئيسي إطلاقاً!'
              : 'Log in with a secondary or dummy Instagram account to farm coins automatically. You can then direct all followers & likes to your main target profile safely!'}
          </p>
        </div>

        {/* Linked Accounts List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span>{language === 'ar' ? 'الحسابات المربوطة للتجميع:' : 'Connected Mining Accounts:'}</span>
            <span className="text-pink-400 text-[11px]">{linkedAccounts.length} {language === 'ar' ? 'حساب متاح' : 'active'}</span>
          </div>

          {linkedAccounts.map((acc) => {
            const isActive = acc.id === activeAccountId;

            return (
              <div
                key={acc.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isActive
                    ? 'bg-[#141414] border-pink-500 shadow-md ring-1 ring-pink-500/50'
                    : 'bg-[#050505] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.username}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500/40"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span>@{acc.username}</span>
                      {isActive && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full font-bold">
                          {language === 'ar' ? 'نشط للتجميع 🟢' : 'MINING ACTIVE 🟢'}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>{acc.proxyLocation}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">🪙 {acc.totalMinedCoins} {language === 'ar' ? 'نقطة' : 'coins'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => {
                        playTapSound();
                        onSelectAccount(acc.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/10"
                    >
                      {language === 'ar' ? 'تنشيط للتجميع' : 'Activate'}
                    </button>
                  )}

                  {linkedAccounts.length > 1 && (
                    <button
                      onClick={() => {
                        playTapSound();
                        onDeleteAccount(acc.id);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-950 hover:text-red-400 text-gray-500 transition-colors"
                      title={language === 'ar' ? 'حذف الحساب' : 'Delete account'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add / Login Instagram Account Section */}
        {!isAdding ? (
          <button
            onClick={() => {
              playTapSound();
              setIsAdding(true);
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>{language === 'ar' ? 'تسجيل دخول حساب انستغرام جديد (تجميع إضافي)' : 'Login New Instagram Account'}</span>
          </button>
        ) : (
          /* Realistic Instagram Login Form inside TopFollow */
          <form onSubmit={handleCreateAccount} className="p-4 rounded-xl bg-[#050505] border border-white/10 space-y-3 relative">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>{language === 'ar' ? 'واجهة تسجيل الدخول إلى انستغرام' : 'Instagram Auth Portal'}</span>
              </h4>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                🔒 SSL Encrypted & Anti-Ban
              </span>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Simulation Overlay */}
            {loginStep > 0 && (
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-pink-500/40 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{loginStatusText}</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-[#dc2743] to-[#cc2366] h-full transition-all duration-500"
                      style={{ width: `${loginStep * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {loginStep === 0 && (
              <>
                {/* Username Field */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1 font-semibold">
                    {language === 'ar' ? 'اسم المستخدم أو البريد (Instagram Username):' : 'Instagram Username or Email:'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-pink-500 font-bold text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. dummy_farmer_2026"
                      className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1 font-semibold">
                    {language === 'ar' ? 'كلمة سر حساب انستغرام (Password):' : 'Instagram Password:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تسجيل الدخول وبدء التجميع' : 'Login & Start Mining'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-xs"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

