import React from 'react';
import { FileText, Wallet, DollarSign, HelpCircle, Send, X, ChevronRight } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface TopFollowSettingsModalProps {
  onClose: () => void;
  onOpenHistory: () => void;
  onOpenStore: () => void;
  onOpenFreeCoins: () => void;
  onOpenSupport: () => void;
}

export const TopFollowSettingsModal: React.FC<TopFollowSettingsModalProps> = ({
  onClose,
  onOpenHistory,
  onOpenStore,
  onOpenFreeCoins,
  onOpenSupport,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#a800e2] text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative font-sans flex flex-col justify-between min-h-[500px]">
        {/* Top Header Bar */}
        <div className="p-4 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-1 font-extrabold text-lg tracking-wide">
            <span>Settings</span>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </div>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items Area */}
        <div className="p-4 space-y-2.5 flex-1 my-auto">
          {/* History */}
          <button
            onClick={() => {
              playTapSound();
              onOpenHistory();
            }}
            className="w-full bg-white text-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-sm">History</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Buy Followers & Likes */}
          <button
            onClick={() => {
              playTapSound();
              onOpenStore();
            }}
            className="w-full bg-white text-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Wallet className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-sm">Buy Followers & Likes</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Free coins */}
          <button
            onClick={() => {
              playTapSound();
              onOpenFreeCoins();
            }}
            className="w-full bg-white text-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-sm">Free coins</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Support / Contact us */}
          <button
            onClick={() => {
              playTapSound();
              onOpenSupport();
            }}
            className="w-full bg-white text-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-sm">Support / Contact us</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Telegram channel */}
          <a
            href="https://t.me/topfollow"
            target="_blank"
            rel="noreferrer"
            onClick={() => playTapSound()}
            className="w-full bg-white text-gray-900 rounded-2xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-98 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Send className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-sm">Telegram channel</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
        </div>

        {/* Bottom Version Text */}
        <div className="p-4 text-center text-xs text-white/70 font-semibold border-t border-purple-500/30">
          5.5.9-R
        </div>
      </div>
    </div>
  );
};
