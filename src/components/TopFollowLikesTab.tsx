import React, { useState } from 'react';
import { UserAccount, Order } from '../types';
import { Heart, CheckCircle2, Zap, Plus, Link, Sparkles, Instagram } from 'lucide-react';
import { playTapSound, playSuccessFanfare } from '../utils/audio';

interface TopFollowLikesTabProps {
  user: UserAccount;
  targetUsername: string;
  onDeductCoins: (amount: number) => boolean;
  onDeductDiamonds: (amount: number) => boolean;
  onCreateOrder: (order: Order) => void;
  onOpenStore: () => void;
}

interface IgPost {
  id: string;
  postUrl: string;
  likesCount: number;
}

const LIKES_PACKAGES = [
  { count: 10, coinCost: 40, diamondCost: 5 },
  { count: 20, coinCost: 80, diamondCost: 10 },
  { count: 50, coinCost: 200, diamondCost: 25 },
  { count: 100, coinCost: 400, diamondCost: 50 },
  { count: 500, coinCost: 2000, diamondCost: 250 },
  { count: 1000, coinCost: 4000, diamondCost: 500 },
];

export const TopFollowLikesTab: React.FC<TopFollowLikesTabProps> = ({
  user,
  targetUsername,
  onDeductCoins,
  onDeductDiamonds,
  onCreateOrder,
  onOpenStore,
}) => {
  const [posts, setPosts] = useState<IgPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IgPost | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'coins' | 'diamonds'>('coins');
  const [selectedPackage, setSelectedPackage] = useState<number>(50);
  const [orderMsg, setOrderMsg] = useState<string | null>(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [customPostUrl, setCustomPostUrl] = useState('');

  const handleAddCustomPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPostUrl.trim()) return;
    playTapSound();

    const newP: IgPost = {
      id: 'custom_p_' + Date.now(),
      postUrl: customPostUrl.trim(),
      likesCount: 0,
    };

    setPosts([newP, ...posts]);
    setSelectedPost(newP);
    setCustomPostUrl('');
    setShowAddPostModal(false);
  };

  const handleBuyLikes = () => {
    if (!selectedPost) return;
    playTapSound();

    const pkg = LIKES_PACKAGES.find((p) => p.count === selectedPackage) || LIKES_PACKAGES[2];
    const cost = selectedCurrency === 'coins' ? pkg.coinCost : pkg.diamondCost;

    if (selectedCurrency === 'coins') {
      if (user.coins < cost) {
        setOrderMsg(`رصيد الذهب غير كافٍ! تحتاج إلى ${cost} ⭐`);
        return;
      }
      const success = onDeductCoins(cost);
      if (!success) return;
    } else {
      if ((user.diamonds || 0) < cost) {
        setOrderMsg(`رصيد الجواهر غير كافٍ! تحتاج إلى ${cost} 💎`);
        return;
      }
      const success = onDeductDiamonds(cost);
      if (!success) return;
    }

    playSuccessFanfare();

    onCreateOrder({
      id: 'ord_like_' + Date.now(),
      type: 'likes',
      targetUsername: targetUsername || 'instagram_user',
      postUrl: selectedPost.postUrl,
      totalQuantity: selectedPackage,
      deliveredQuantity: 0,
      costInCoins: cost,
      status: 'active',
      createdAt: new Date().toISOString(),
      estimatedDeliverySpeed: 'turbo',
    });

    setOrderMsg(`تم إرسال ${selectedPackage} لايك إلى المنشور بنجاح! 🎉`);
    setTimeout(() => {
      setSelectedPost(null);
      setOrderMsg(null);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-3 pb-24 font-sans text-gray-800">
      {/* Add Custom Post Link Header Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex items-center justify-between">
        <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
          <span>لايكات المنشورات {targetUsername ? `(@${targetUsername})` : ''}</span>
        </div>

        <button
          onClick={() => {
            playTapSound();
            setShowAddPostModal(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة رابط منشور</span>
        </button>
      </div>

      {/* Currency Toggle */}
      <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            playTapSound();
            setSelectedCurrency('coins');
          }}
          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            selectedCurrency === 'coins'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>الشراء بالذهب (⭐)</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setSelectedCurrency('diamonds');
          }}
          className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            selectedCurrency === 'diamonds'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>الشراء بالجواهر (💎)</span>
        </button>
      </div>

      {/* Inline Direct Add Post Form if Posts is Empty */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Instagram className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-gray-900">لا يوجد منشورات مضافة بعد</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              ضع رابط أي منشور من حسابك في انستغرام لزيادة اللايكات فوراً بجميع العملات!
            </p>
          </div>

          <form onSubmit={handleAddCustomPost} className="space-y-2.5 max-w-xs mx-auto">
            <div className="relative">
              <input
                type="url"
                value={customPostUrl}
                onChange={(e) => setCustomPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/..."
                required
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Link className="w-4 h-4 text-purple-600 absolute left-3 top-3.5" />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المنشور الآن</span>
            </button>
          </form>
        </div>
      ) : (
        /* Posts Thumbnail Grid */
        <div className="grid grid-cols-2 gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                playTapSound();
                setSelectedPost(post);
              }}
              className="relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 p-4 cursor-pointer aspect-square border border-purple-300/20 hover:scale-[1.02] transition-transform flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-white/80">
                <Instagram className="w-5 h-5 text-rose-400" />
                <span className="text-[10px] font-mono truncate text-white/70">
                  {post.postUrl.replace('https://www.instagram.com/p/', '').replace('/', '')}
                </span>
              </div>

              <div className="text-center py-2">
                <div className="text-xs font-black text-white truncate max-w-full">
                  منشور انستغرام
                </div>
                <div className="text-[10px] text-purple-200 mt-0.5">اضغط لاختيار عدد اللايكات</div>
              </div>

              {/* Bottom Right Likes Count Badge */}
              <div className="self-end bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-white shadow-lg flex items-center gap-1 border border-white/20">
                <span>{post.likesCount}</span>
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Post Link Modal */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddPostModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
                <Link className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">إضافة منشور انستغرام</h3>
              <p className="text-xs text-gray-500">ضع رابط منشورك في انستغرام لزيادة اللايكات فوراً</p>
            </div>

            <form onSubmit={handleAddCustomPost} className="space-y-3">
              <input
                type="url"
                value={customPostUrl}
                onChange={(e) => setCustomPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/..."
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
              >
                تأكيد المنشور
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Buy Likes Selection Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b pb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">تزويد لايكات للمنشور</h3>
                <p className="text-xs text-purple-700 font-bold truncate max-w-[180px]">
                  {selectedPost.postUrl}
                </p>
              </div>
            </div>

            {/* Likes Packages */}
            <div className="grid grid-cols-3 gap-2">
              {LIKES_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.count;
                const cost = selectedCurrency === 'coins' ? pkg.coinCost : pkg.diamondCost;

                return (
                  <button
                    key={pkg.count}
                    onClick={() => {
                      playTapSound();
                      setSelectedPackage(pkg.count);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 font-medium'
                    }`}
                  >
                    <div className="text-sm font-black">+{pkg.count}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-300' : 'text-amber-600'}`}>
                      {cost} {selectedCurrency === 'coins' ? '⭐' : '💎'}
                    </div>
                  </button>
                );
              })}
            </div>

            {orderMsg && (
              <div className="p-3 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs text-center font-bold">
                {orderMsg}
              </div>
            )}

            {/* Get Button */}
            <button
              onClick={handleBuyLikes}
              className="w-full py-3.5 rounded-xl bg-[#ffa000] hover:bg-[#ff8f00] text-white font-extrabold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>
                Get (+{selectedPackage} ❤️)
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
