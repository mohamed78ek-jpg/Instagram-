import React, { useState } from 'react';
import { AppLanguage, UserAccount, LinkedIgAccount } from '../types';
import { Coins, Volume2, VolumeX, Globe, PlusCircle, Crown, UserCheck, Sparkles, Instagram } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface NavbarProps {
  user: UserAccount;
  linkedAccounts: LinkedIgAccount[];
  language: AppLanguage;
  soundEnabled: boolean;
  onLanguageChange: (lang: AppLanguage) => void;
  onSoundToggle: () => void;
  onOpenStore: () => void;
  onOpenAccountsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  linkedAccounts,
  language,
  soundEnabled,
  onLanguageChange,
  onSoundToggle,
  onOpenStore,
  onOpenAccountsModal,
}) => {
  const activeAccount = linkedAccounts.find((a) => a.id === user.activeLinkedAccountId) || linkedAccounts[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-3 sm:px-12 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => playTapSound()}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl font-bold italic text-white tracking-tighter">TF</span>
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {language === 'ar' ? 'توب فلو' : 'TopFollow'} <span className="text-[#dc2743]">بلس</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 flex items-center gap-1">
                <Crown className="w-3 h-3 text-pink-500" />
                PRO
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              {language === 'ar' ? 'منصة زيادة متابعين ولايكات انستغرام' : 'Instagram Followers & Likes Exchange Platform'}
            </p>
          </div>
        </div>

        {/* Center/Account Badge: Active IG account selector or Login Button */}
        <button
          onClick={() => {
            playTapSound();
            onOpenAccountsModal();
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-white/10 border border-pink-500/30 text-gray-200 text-xs transition-all active:scale-95 shadow-md"
          title={language === 'ar' ? 'تسجيل الدخول / إدارة حسابات انستغرام' : 'Instagram Login & Accounts'}
        >
          <div className="relative">
            <img
              src={activeAccount?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={activeAccount?.username}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-500/50"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0a0a0a]" />
          </div>
          <span className="font-bold text-white text-[11px] sm:text-xs truncate max-w-[90px] sm:max-w-none">
            @{activeAccount?.username || 'dummy_acc'}
          </span>
          <span className="hidden sm:inline-block text-[10px] text-pink-400 bg-pink-500/10 px-1.5 py-0.2 rounded font-semibold border border-pink-500/20">
            {language === 'ar' ? 'حساب التجميع' : 'Mining IG'}
          </span>
        </button>

        {/* Right side controls: Coins balance + Store + Language + Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Animated Coin Counter Badge */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full pl-3 pr-1 py-1 shadow-lg shadow-pink-500/5">
            <div className="flex items-center gap-1.5 mr-2">
              <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="font-extrabold text-amber-400 text-sm sm:text-base tracking-wide">
                {user.coins.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                {language === 'ar' ? 'نقطة' : 'coins'}
              </span>
            </div>

            <button
              onClick={() => {
                playTapSound();
                onOpenStore();
              }}
              className="flex items-center justify-center p-1.5 bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-90 text-white rounded-full font-bold shadow-md shadow-pink-600/30 transition-transform active:scale-95"
              title={language === 'ar' ? 'شراء نقاط إضافية' : 'Buy extra coins'}
            >
              <PlusCircle className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onSoundToggle();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors"
            title={soundEnabled ? (language === 'ar' ? 'كتم الصوت' : 'Mute sound') : (language === 'ar' ? 'تشغيل الصوت' : 'Unmute sound')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              playTapSound();
              onLanguageChange(language === 'ar' ? 'en' : 'ar');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
