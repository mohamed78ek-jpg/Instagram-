import React, { useState, useEffect } from 'react';
import { UserAccount, LinkedIgAccount, MiningLog } from '../types';
import { Coins, UserPlus, Sliders, X, Play, Pause, ShieldCheck } from 'lucide-react';
import { playTapSound, playCoinSound } from '../utils/audio';

interface TopFollowTasksTabProps {
  user: UserAccount;
  linkedAccounts: LinkedIgAccount[];
  onOpenAddAccount: () => void;
  onOpenSettings: () => void;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  onUpdateLinkedAccounts: (updated: LinkedIgAccount[]) => void;
  onAddCoins: (amount: number) => void;
  onLogAdd: (log: MiningLog) => void;
}

export const TopFollowTasksTab: React.FC<TopFollowTasksTabProps> = ({
  user,
  linkedAccounts,
  onOpenAddAccount,
  onOpenSettings,
  onUpdateUser,
  onUpdateLinkedAccounts,
  onAddCoins,
  onLogAdd,
}) => {
  const [isMiningRunning, setIsMiningRunning] = useState(false);
  const [taskType, setTaskType] = useState<'Follow' | 'Likes' | 'Both'>('Follow');

  // Toggle account selected state for mining
  const handleToggleAccountSelection = (accId: string) => {
    playTapSound();
    onUpdateLinkedAccounts(
      linkedAccounts.map((a) =>
        a.id === accId ? { ...a, isSelectedForMining: !a.isSelectedForMining } : a
      )
    );
  };

  // Remove account
  const handleRemoveAccount = (accId: string) => {
    playTapSound();
    onUpdateLinkedAccounts(linkedAccounts.filter((a) => a.id !== accId));
  };

  // Toggle Anti-Ban switch
  const handleToggleAntiBan = () => {
    playTapSound();
    onUpdateUser({ antiBanEnabled: !user.antiBanEnabled });
  };

  // Mining loop simulation
  useEffect(() => {
    if (!isMiningRunning) return;

    const selectedAccs = linkedAccounts.filter((a) => a.isSelectedForMining !== false);
    if (selectedAccs.length === 0) {
      setIsMiningRunning(false);
      return;
    }

    const interval = setInterval(() => {
      const activeAcc = selectedAccs[Math.floor(Math.random() * selectedAccs.length)];
      const coins = taskType === 'Follow' ? 4 : 2;

      onAddCoins(coins);
      playCoinSound();

      // Update account total mined coins badge
      onUpdateLinkedAccounts(
        linkedAccounts.map((a) =>
          a.id === activeAcc.id
            ? { ...a, totalMinedCoins: (a.totalMinedCoins || 0) + coins }
            : a
        )
      );

      // Add log
      onLogAdd({
        id: 'log_' + Date.now(),
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        actionType: taskType === 'Likes' ? 'like' : 'follow',
        targetUser: 'user_' + Math.floor(Math.random() * 90000 + 10000),
        coinsEarned: coins,
        accountId: activeAcc.id,
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isMiningRunning, linkedAccounts, taskType]);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 font-sans text-gray-800">
      {/* Top Card 1: 3 Main Action Buttons */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 grid grid-cols-3 gap-3 text-center">
        {/* Tasks Button */}
        <button
          onClick={() => playTapSound()}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 shadow-sm">
            <Coins className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-bold text-gray-800">Tasks</span>
        </button>

        {/* Add Account Button */}
        <button
          onClick={() => {
            playTapSound();
            onOpenAddAccount();
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 shadow-sm">
            <UserPlus className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-bold text-gray-800">Add account</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            playTapSound();
            onOpenSettings();
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 shadow-sm">
            <Sliders className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-bold text-gray-800">Settings</span>
        </button>
      </div>

      {/* Card 2: Sub Header (Follow label + Anti-Ban switch) */}
      <div className="bg-white rounded-2xl px-5 py-3.5 shadow-md border border-gray-100 flex items-center justify-between">
        {/* Left: Follow dropdown / label */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTapSound();
              setTaskType(taskType === 'Follow' ? 'Likes' : taskType === 'Likes' ? 'Both' : 'Follow');
            }}
            className="text-base font-extrabold text-purple-800 hover:text-purple-900 transition-colors"
          >
            {taskType}
          </button>
        </div>

        {/* Right: Anti-Ban switch */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-800">Anti-Ban</span>
          <button
            onClick={handleToggleAntiBan}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
              user.antiBanEnabled ? 'bg-purple-600 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>
      </div>

      {/* Card 3: Accounts List Area */}
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 min-h-[220px] space-y-2">
        {linkedAccounts.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            لا يوجد حسابات مربوطة للتجميع. اضغط على "Add account" للربط!
          </div>
        ) : (
          linkedAccounts.map((acc) => {
            const isSelected = acc.isSelectedForMining !== false;

            return (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 hover:bg-gray-100/80 transition-colors border border-gray-100"
              >
                {/* Left Side: Toggle switch + Remove X button + Mined Coins Badge */}
                <div className="flex items-center gap-2.5">
                  {/* Account Mining Toggle Switch */}
                  <button
                    onClick={() => handleToggleAccountSelection(acc.id)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                      isSelected ? 'bg-purple-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>

                  {/* Remove Account X Icon */}
                  <button
                    onClick={() => handleRemoveAccount(acc.id)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-500 flex items-center justify-center transition-colors"
                    title="Remove Account"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Mined Coins Count Badge */}
                  <div className="flex items-center gap-1 bg-amber-100/80 border border-amber-300/50 px-2 py-0.5 rounded-full text-xs font-bold text-amber-800">
                    <span>{acc.totalMinedCoins || 0}</span>
                    <span className="text-amber-500 text-xs">⭐</span>
                  </div>
                </div>

                {/* Right Side: Username + Avatar Badge */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-gray-800">{acc.username}</span>
                  {acc.avatarUrl && acc.avatarUrl.startsWith('http') ? (
                    <img
                      src={acc.avatarUrl}
                      alt={acc.username}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs ring-2 ring-purple-100 shadow-sm">
                      {acc.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Big Orange Start Button at Bottom Center */}
      <div className="pt-2">
        <button
          onClick={() => {
            playTapSound();
            setIsMiningRunning(!isMiningRunning);
          }}
          className={`w-full py-4 rounded-2xl text-white font-extrabold text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
            isMiningRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-[#ffa000] hover:bg-[#ff8f00]'
          }`}
        >
          {isMiningRunning ? (
            <>
              <Pause className="w-6 h-6 fill-current animate-pulse" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
