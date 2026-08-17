import React, { useState, useEffect } from 'react';
import { AppLanguage, UserAccount, LinkedIgAccount, MiningLog } from '../types';
import { Zap, Play, Pause, ShieldCheck, RefreshCw, Cpu, Activity, UserPlus, Heart, Flame, Settings2 } from 'lucide-react';
import { playCoinSound, playTapSound } from '../utils/audio';

interface AutoMiningEngineProps {
  user: UserAccount;
  linkedAccounts: LinkedIgAccount[];
  language: AppLanguage;
  onAddCoins: (amount: number) => void;
  onLogAdd: (log: MiningLog) => void;
  logs: MiningLog[];
  onOpenAccountsModal: () => void;
}

export const AutoMiningEngine: React.FC<AutoMiningEngineProps> = ({
  user,
  linkedAccounts,
  language,
  onAddCoins,
  onLogAdd,
  logs,
  onOpenAccountsModal,
}) => {
  const [isMining, setIsMining] = useState(false);
  const [miningMode, setMiningMode] = useState<'both' | 'followers' | 'likes'>('both');
  const [miningSpeed, setMiningSpeed] = useState<'normal' | 'turbo' | 'insane'>('turbo');
  const [minedSessionCoins, setMinedSessionCoins] = useState(0);

  const activeAccount =
    linkedAccounts.find((a) => a.id === user.activeLinkedAccountId) || linkedAccounts[0];

  // Auto mining timer loop
  useEffect(() => {
    if (!isMining) return;

    const speedIntervals = {
      normal: 4000,
      turbo: 2200,
      insane: 1100,
    };

    const intervalTime = speedIntervals[miningSpeed];

    const interval = setInterval(() => {
      // Simulate follow or like
      const sampleTargets = [
        'sara_fashion_01', 'khalid_vibe', 'luxury_dubai_official', 'tech_creator',
        'salma_beauty_sa', 'gaming_arabia', 'fitness_master_eg', 'travel_vibes_kw',
        'foodie_riyadh', 'crypto_king_me', 'artist_nour', 'designer_ziad'
      ];

      const randomTarget = sampleTargets[Math.floor(Math.random() * sampleTargets.length)];
      const isFollowAction = miningMode === 'followers' ? true : miningMode === 'likes' ? false : Math.random() > 0.4;
      const coinsEarned = isFollowAction ? 4 : 2;

      // Add coins & play sound
      onAddCoins(coinsEarned);
      setMinedSessionCoins((prev) => prev + coinsEarned);
      playCoinSound();

      // Log action
      const newLog: MiningLog = {
        id: 'log_' + Date.now(),
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        actionType: isFollowAction ? 'follow' : 'like',
        targetUser: randomTarget,
        postShortcode: !isFollowAction ? 'p/' + Math.random().toString(36).substring(2, 8) : undefined,
        coinsEarned,
        accountId: activeAccount?.id || 'acc_1',
      };

      onLogAdd(newLog);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isMining, miningMode, miningSpeed, activeAccount, language, onAddCoins, onLogAdd]);

  const handleManualAction = (type: 'follow' | 'like') => {
    playTapSound();
    const coins = type === 'follow' ? 4 : 2;
    onAddCoins(coins);
    setMinedSessionCoins((prev) => prev + coins);
    playCoinSound();

    const sampleTargets = ['instastyle_sa', 'arab_fit', 'coffee_lover_kw', 'design_art_me'];
    const randomTarget = sampleTargets[Math.floor(Math.random() * sampleTargets.length)];

    onLogAdd({
      id: 'manual_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      actionType: type,
      targetUser: randomTarget,
      coinsEarned: coins,
      accountId: activeAccount?.id || 'acc_1',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Hero: Mining Status & Power Switch */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#dc2743]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Active Account Details */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <img
                src={activeAccount?.avatarUrl}
                alt={activeAccount?.username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/10 shadow-xl"
              />
              <span
                className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ${
                  isMining ? 'bg-emerald-500 animate-ping' : 'bg-orange-500'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">@{activeAccount?.username}</h2>
                <button
                  onClick={() => {
                    playTapSound();
                    onOpenAccountsModal();
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                >
                  {language === 'ar' ? 'تبديل الحساب' : 'Switch'}
                </button>
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span>{activeAccount?.fullName}</span>
                <span>•</span>
                <span className="text-pink-400 font-medium">{activeAccount?.proxyLocation}</span>
              </p>

              {/* Health Score & Anti-Ban Safeguard */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ar'
                      ? `حماية الحساب: ${activeAccount?.healthScore}%`
                      : `Health Score: ${activeAccount?.healthScore}%`}
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 font-medium">
                  {language === 'ar'
                    ? `أدّيت اليوم: +${activeAccount?.totalMinedCoins} نقطة`
                    : `Mined Today: +${activeAccount?.totalMinedCoins}`}
                </div>
              </div>
            </div>
          </div>

          {/* Big Start / Stop Power Button */}
          <div className="flex flex-col items-center justify-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                playTapSound();
                setIsMining(!isMining);
              }}
              className={`relative group w-full md:w-60 py-4 px-6 rounded-2xl font-extrabold text-base sm:text-lg tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
                isMining
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-rose-600/40 ring-2 ring-rose-500/30'
                  : 'bg-gradient-to-r from-[#dc2743] to-[#cc2366] text-white shadow-pink-600/30 hover:scale-105 ring-2 ring-pink-500/30'
              }`}
            >
              {isMining ? (
                <>
                  <Pause className="w-6 h-6 fill-current animate-pulse" />
                  <span>{language === 'ar' ? 'إيقاف التجميع' : 'STOP MINING'}</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>{language === 'ar' ? 'بدء التجميع التلقائي' : 'START AUTO MINING'}</span>
                </>
              )}
            </button>

            {/* Session Stats */}
            <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
              <Activity className={`w-3.5 h-3.5 ${isMining ? 'text-emerald-400 animate-spin' : 'text-gray-500'}`} />
              <span>
                {language === 'ar'
                  ? `أرباح هذه الجلسة: +${minedSessionCoins} نقطة`
                  : `Session Coins: +${minedSessionCoins}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Mode & Speed Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Action Mode Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-pink-500" />
              <span>{language === 'ar' ? 'نوع التجهيز والمهام' : 'Target Task Type'}</span>
            </h3>
            <span className="text-[10px] bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded-full border border-pink-500/20 font-semibold">
              {language === 'ar' ? 'متابعة + لايك' : 'Follow + Like'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'both', labelAr: 'الكل (مستحسن)', labelEn: 'Both (Recommended)', icon: Flame },
              { id: 'followers', labelAr: 'متابعات (+4)', labelEn: 'Followers (+4)', icon: UserPlus },
              { id: 'likes', labelAr: 'لايكات (+2)', labelEn: 'Likes (+2)', icon: Heart },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = miningMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    playTapSound();
                    setMiningMode(m.id as any);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-pink-500/10 border-pink-500/50 text-white shadow-lg shadow-pink-500/10'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-pink-500' : 'text-gray-500'}`} />
                  <span>{language === 'ar' ? m.labelAr : m.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed Controls Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-400" />
              <span>{language === 'ar' ? 'سرعة التجميع وإيقاع الفواصل' : 'Mining Speed Interval'}</span>
            </h3>
            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20 font-semibold">
              {miningSpeed === 'insane' ? '1s Ultra' : miningSpeed === 'turbo' ? '2.2s Turbo' : '4s Safe'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', labelAr: 'آمن (4ث)', labelEn: 'Safe (4s)', desc: '0% Ban risk' },
              { id: 'turbo', labelAr: 'سريع (2ث)', labelEn: 'Turbo (2.2s)', desc: 'High Efficiency' },
              { id: 'insane', labelAr: 'فائق (1ث)', labelEn: 'Ultra (1s)', desc: 'Maximum Speed' },
            ].map((s) => {
              const isSelected = miningSpeed === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    playTapSound();
                    setMiningSpeed(s.id as any);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/50 text-amber-300 shadow-lg shadow-orange-500/10'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold">{language === 'ar' ? s.labelAr : s.labelEn}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{s.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manual Quick Earn Buttons */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-gray-300">
          <span className="font-bold text-amber-400">{language === 'ar' ? '💡 التجميع اليدوي السريع:' : '💡 Quick Manual Earn:'}</span>{' '}
          {language === 'ar' ? 'اضغط للحصول على نقاط فورية بيدك' : 'Tap to instantly earn coins manually'}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleManualAction('follow')}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5 text-pink-500" />
            <span>{language === 'ar' ? 'متابعة حساب (+4 نقاط)' : 'Follow (+4 Coins)'}</span>
          </button>

          <button
            onClick={() => handleManualAction('like')}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
          >
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/30" />
            <span>{language === 'ar' ? 'إعجاب (+2 نقطة)' : 'Like (+2 Coins)'}</span>
          </button>
        </div>
      </div>

      {/* Terminal / Live Task Activity Stream */}
      <div className="bg-[#050505] border border-white/10 rounded-2xl p-5 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-gray-200 font-sans font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{language === 'ar' ? 'سجل العمليات المباشر (التجميع التلقائي)' : 'Live Mining Terminal Stream'}</span>
          </div>

          <span className="text-[10px] text-gray-500">
            {logs.length} {language === 'ar' ? 'عميلة مسجلة' : 'actions logged'}
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
          {logs.length === 0 ? (
            <p className="text-gray-600 italic text-center py-4">
              {language === 'ar' ? 'اضغط على "بدء التجميع التلقائي" لرؤية حركة النقاط المباشرة' : 'Click "START AUTO MINING" to see live task feed'}
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[10px]">{log.timestamp}</span>
                  {log.actionType === 'follow' ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold">
                      FOLLOW
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                      LIKE
                    </span>
                  )}
                  <span className="text-gray-200 font-medium">@{log.targetUser}</span>
                </div>

                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <span>+{log.coinsEarned}</span>
                  <span className="text-[10px] text-amber-500/80">coins</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
