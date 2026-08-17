import React, { useState, useEffect } from 'react';
import { AppLanguage, UserAccount, LinkedIgAccount, Order, PromoCode, MiningLog } from './types';
import {
  loadUser,
  saveUser,
  loadLinkedAccounts,
  saveLinkedAccounts,
  loadOrders,
  saveOrders,
  loadPromoCodes,
  savePromoCodes,
  loadMiningLogs,
  saveMiningLogs,
} from './utils/storage';
import { setSoundEnabled } from './utils/audio';

import { TopFollowHeader } from './components/TopFollowHeader';
import { TopFollowBottomNav, TopFollowTab } from './components/TopFollowBottomNav';
import { TopFollowTasksTab } from './components/TopFollowTasksTab';
import { TopFollowLikesTab } from './components/TopFollowLikesTab';
import { TopFollowFollowersTab } from './components/TopFollowFollowersTab';
import { TopFollowMoreTab } from './components/TopFollowMoreTab';
import { TopFollowLoginScreen } from './components/TopFollowLoginScreen';
import { TopFollowSettingsModal } from './components/TopFollowSettingsModal';
import { CoinStoreVIP } from './components/CoinStoreVIP';
import { OrdersTracker } from './components/OrdersTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState<TopFollowTab>('tasks');
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // State
  const [user, setUser] = useState<UserAccount>(loadUser);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedIgAccount[]>(loadLinkedAccounts);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(loadPromoCodes);
  const [miningLogs, setMiningLogs] = useState<MiningLog[]>(loadMiningLogs);

  // Target Instagram account for ordering followers/likes
  const [targetUsername, setTargetUsername] = useState<string>(() => {
    const accs = loadLinkedAccounts();
    return accs.length > 0 ? accs[0].username : '';
  });
  const [targetAvatarUrl, setTargetAvatarUrl] = useState<string>(() => {
    const accs = loadLinkedAccounts();
    return accs.length > 0 ? accs[0].avatarUrl || '' : '';
  });

  // Save to LocalStorage
  useEffect(() => { saveUser(user); }, [user]);
  useEffect(() => { saveLinkedAccounts(linkedAccounts); }, [linkedAccounts]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { savePromoCodes(promoCodes); }, [promoCodes]);
  useEffect(() => { saveMiningLogs(miningLogs); }, [miningLogs]);

  // Handlers
  const handleAddCoins = (amount: number) => {
    setUser((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const handleDeductCoins = (amount: number): boolean => {
    if (user.coins < amount) return false;
    setUser((prev) => ({ ...prev, coins: prev.coins - amount }));
    return true;
  };

  const handleDeductDiamonds = (amount: number): boolean => {
    if ((user.diamonds || 0) < amount) return false;
    setUser((prev) => ({ ...prev, diamonds: (prev.diamonds || 0) - amount }));
    return true;
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setUser((prev) => ({
      ...prev,
      totalFollowersDelivered:
        newOrder.type === 'followers'
          ? prev.totalFollowersDelivered + newOrder.totalQuantity
          : prev.totalFollowersDelivered,
      totalLikesDelivered:
        newOrder.type === 'likes'
          ? prev.totalLikesDelivered + newOrder.totalQuantity
          : prev.totalLikesDelivered,
    }));
  };

  const handleRedeemPromoCode = (codeStr: string): boolean => {
    const codeObj = promoCodes.find((p) => p.code.toUpperCase() === codeStr.toUpperCase());
    if (codeObj && !codeObj.isRedeemed) {
      setPromoCodes((prev) =>
        prev.map((p) => (p.code.toUpperCase() === codeStr.toUpperCase() ? { ...p, isRedeemed: true } : p))
      );
      handleAddCoins(codeObj.coinsReward);
      return true;
    }
    return false;
  };

  const handleLoginSuccess = (
    newAcc: LinkedIgAccount,
    bonusCoins = 3000,
    bonusDiamonds = 500
  ) => {
    setLinkedAccounts((prev) => [newAcc, ...prev]);
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + bonusCoins,
      diamonds: (prev.diamonds || 0) + bonusDiamonds,
      activeLinkedAccountId: newAcc.id,
    }));
    setTargetUsername(newAcc.username);
    setTargetAvatarUrl(newAcc.avatarUrl);
    setShowLoginScreen(false);
  };

  const handleAddLog = (log: MiningLog) => {
    setMiningLogs((prev) => [log, ...prev].slice(0, 50));
  };

  if (showLoginScreen) {
    return (
      <TopFollowLoginScreen
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setShowLoginScreen(false)}
        linkedAccounts={linkedAccounts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#eceaf0] text-gray-900 font-sans flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* TopFollow Purple Header Bar */}
      <TopFollowHeader
        user={user}
        activeTab={activeTab}
        targetUsername={targetUsername}
        targetAvatarUrl={targetAvatarUrl}
        targetFollowersCount={user.totalFollowersDelivered || 6217}
        onOpenSettings={() => setShowSettingsModal(true)}
        onSelectTargetAccount={() => setShowLoginScreen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
        {activeTab === 'tasks' && (
          <TopFollowTasksTab
            user={user}
            linkedAccounts={linkedAccounts}
            onOpenAddAccount={() => setShowLoginScreen(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onUpdateLinkedAccounts={setLinkedAccounts}
            onAddCoins={handleAddCoins}
            onLogAdd={handleAddLog}
          />
        )}

        {activeTab === 'likes' && (
          <TopFollowLikesTab
            user={user}
            targetUsername={targetUsername}
            onDeductCoins={handleDeductCoins}
            onDeductDiamonds={handleDeductDiamonds}
            onCreateOrder={handleCreateOrder}
            onOpenStore={() => setShowStoreModal(true)}
          />
        )}

        {activeTab === 'followers' && (
          <TopFollowFollowersTab
            user={user}
            targetUsername={targetUsername}
            onDeductCoins={handleDeductCoins}
            onDeductDiamonds={handleDeductDiamonds}
            onCreateOrder={handleCreateOrder}
            onOpenStore={() => setShowStoreModal(true)}
            onChangeTargetUsername={() => setShowLoginScreen(true)}
          />
        )}

        {activeTab === 'more' && (
          <TopFollowMoreTab
            user={user}
            promoCodes={promoCodes}
            onAddCoins={handleAddCoins}
            onRedeemPromoCode={handleRedeemPromoCode}
            onOpenStore={() => setShowStoreModal(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Purple Navigation Bar */}
      <TopFollowBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Settings Modal */}
      {showSettingsModal && (
        <TopFollowSettingsModal
          onClose={() => setShowSettingsModal(false)}
          onOpenHistory={() => {
            setShowSettingsModal(false);
            setShowHistoryModal(true);
          }}
          onOpenStore={() => {
            setShowSettingsModal(false);
            setShowStoreModal(true);
          }}
          onOpenFreeCoins={() => {
            setShowSettingsModal(false);
            setActiveTab('more');
          }}
          onOpenSupport={() => {
            setShowSettingsModal(false);
            alert('TopFollow Support: support@topfollow.app');
          }}
        />
      )}

      {/* Store Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowStoreModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>
            <CoinStoreVIP
              user={user}
              language="ar"
              onAddCoins={handleAddCoins}
              onUpgradeVip={(lvl) => setUser((prev) => ({ ...prev, vipLevel: lvl }))}
            />
          </div>
        </div>
      )}

      {/* History / Orders Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>
            <h2 className="text-lg font-black text-purple-900 text-center">سجل الطلبات (Order History)</h2>
            <OrdersTracker
              orders={orders}
              language="ar"
              onRefillOrder={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
