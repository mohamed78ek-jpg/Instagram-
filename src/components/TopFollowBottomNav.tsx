import React from 'react';
import { Coins, Heart, UserPlus, Sparkles } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export type TopFollowTab = 'tasks' | 'likes' | 'followers' | 'more';

interface TopFollowBottomNavProps {
  activeTab: TopFollowTab;
  onSelectTab: (tab: TopFollowTab) => void;
}

export const TopFollowBottomNav: React.FC<TopFollowBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'tasks' as TopFollowTab, label: 'Tasks', icon: Coins },
    { id: 'likes' as TopFollowTab, label: 'Likes', icon: Heart },
    { id: 'followers' as TopFollowTab, label: 'Followers', icon: UserPlus },
    { id: 'more' as TopFollowTab, label: 'More', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#a800e2] text-white border-t border-purple-600/30 shadow-2xl z-40">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTapSound();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center transition-colors active:scale-95 ${
                isActive ? 'text-white font-bold opacity-100' : 'text-purple-200/70 hover:text-white opacity-80'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-white/20' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-current text-white' : ''}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
