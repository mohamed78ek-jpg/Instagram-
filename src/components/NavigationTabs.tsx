import React from 'react';
import { AppLanguage } from '../types';
import { Zap, Users, Heart, Gift, ListOrdered, ShoppingBag, Sparkles } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export type TabType = 'mining' | 'followers' | 'likes' | 'rewards' | 'orders' | 'store' | 'ai';

interface NavigationTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  language: AppLanguage;
  pendingOrdersCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  language,
  pendingOrdersCount = 0,
}) => {
  const tabs = [
    {
      id: 'mining' as TabType,
      labelAr: 'تجميع النقاط',
      labelEn: 'Auto Mining',
      icon: Zap,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'followers' as TabType,
      labelAr: 'طلب متابعين',
      labelEn: 'Get Followers',
      icon: Users,
    },
    {
      id: 'likes' as TabType,
      labelAr: 'لايكات وتفاعل',
      labelEn: 'Get Likes',
      icon: Heart,
    },
    {
      id: 'rewards' as TabType,
      labelAr: 'الكودات والمكافآت',
      labelEn: 'Codes & Rewards',
      icon: Gift,
      badge: 'FREE',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'orders' as TabType,
      labelAr: 'طلباتي',
      labelEn: 'My Orders',
      icon: ListOrdered,
      count: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'store' as TabType,
      labelAr: 'المتجر VIP',
      labelEn: 'VIP Store',
      icon: ShoppingBag,
    },
    {
      id: 'ai' as TabType,
      labelAr: 'مساعد الذكاء',
      labelEn: 'AI Assistant',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    },
  ];

  return (
    <nav className="bg-[#0a0a0a]/90 border-b border-white/5 sticky top-[61px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-12">
        <div className="flex items-center justify-between sm:justify-start gap-1.5 overflow-x-auto no-scrollbar py-2.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => {
                  playTapSound();
                  onSelectTab(t.id);
                }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#dc2743] to-[#cc2366] text-white shadow-xl shadow-pink-600/30 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                />
                <span>{language === 'ar' ? t.labelAr : t.labelEn}</span>

                {t.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      isActive ? 'bg-white/20 text-white border-white/30' : 'bg-pink-500/10 text-pink-500 border-pink-500/20'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}

                {t.count !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-[#f09433] text-black font-extrabold text-[10px] flex items-center justify-center">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
