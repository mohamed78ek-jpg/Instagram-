import React from 'react';
import { UserAccount, LinkedIgAccount } from '../types';
import { Settings, User, Sparkles } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface TopFollowHeaderProps {
  user: UserAccount;
  activeTab: string;
  targetUsername: string;
  targetAvatarUrl: string;
  targetFollowersCount: number;
  onOpenSettings: () => void;
  onSelectTargetAccount: () => void;
}

export const TopFollowHeader: React.FC<TopFollowHeaderProps> = ({
  user,
  activeTab,
  targetUsername,
  targetAvatarUrl,
  targetFollowersCount,
  onOpenSettings,
  onSelectTargetAccount,
}) => {
  return (
    <header className="bg-[#a800e2] text-white px-4 py-3 shadow-md border-b border-purple-600/30 sticky top-0 z-30">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left Side: Settings Gear or Followers Count */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTapSound();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-transform active:scale-90"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>

          {activeTab === 'followers' && (
            <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-xs font-bold">
              <span>{targetFollowersCount.toLocaleString()}</span>
              <User className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Center: Target Account Selector in Likes / Followers Tabs */}
        {(activeTab === 'likes' || activeTab === 'followers') && (
          <button
            onClick={() => {
              playTapSound();
              onSelectTargetAccount();
            }}
            className="flex items-center gap-2 px-3 py-1 bg-white text-gray-900 rounded-full shadow-md text-xs font-bold hover:bg-gray-100 transition-transform active:scale-95"
          >
            <span className="truncate max-w-[120px]">{targetUsername ? `@${targetUsername}` : 'ربط حساب'}</span>
            {targetAvatarUrl && targetAvatarUrl.startsWith('http') ? (
              <img
                src={targetAvatarUrl}
                alt={targetUsername}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-500"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 text-white flex items-center justify-center font-black text-[9px]">
                {targetUsername ? targetUsername.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </button>
        )}

        {/* Right Side: Diamonds and Coins Badges */}
        <div className="flex items-center gap-1.5">
          {/* Diamond Badge */}
          <div className="flex items-center gap-1 bg-purple-900/40 border border-purple-300/30 px-2.5 py-1 rounded-full text-xs font-black shadow-inner">
            <span className="text-cyan-300 font-extrabold">{user.diamonds || 400}</span>
            <span className="text-cyan-300 text-sm">💎</span>
          </div>

          {/* Gold Coin Badge */}
          <div className="flex items-center gap-1 bg-purple-900/40 border border-purple-300/30 px-2.5 py-1 rounded-full text-xs font-black shadow-inner">
            <span className="text-amber-300 font-extrabold">{user.coins.toLocaleString()}</span>
            <span className="text-amber-300 text-sm">⭐</span>
          </div>
        </div>
      </div>
    </header>
  );
};
