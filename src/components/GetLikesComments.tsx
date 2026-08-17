import React, { useState } from 'react';
import { AppLanguage, UserAccount, Order, IgPost } from '../types';
import { Heart, MessageSquare, Link, Sparkles, CheckCircle2, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { playSuccessFanfare, playTapSound } from '../utils/audio';

interface GetLikesCommentsProps {
  user: UserAccount;
  language: AppLanguage;
  onDeductCoins: (amount: number) => boolean;
  onCreateOrder: (order: Order) => void;
  onOpenStore: () => void;
}

const SAMPLE_POSTS: IgPost[] = [
  {
    id: 'post_1',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80',
    likesCount: 340,
    commentsCount: 18,
    caption: 'أجواء رائعة وتصوير مميز اليوم 📸✨ #انستغرام #تصوير',
    postUrl: 'https://instagram.com/p/C3xY901m12',
  },
  {
    id: 'post_2',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
    likesCount: 1250,
    commentsCount: 84,
    caption: 'الفخامة والأداء العالي 🔥🚗 #سيارات #دبي',
    postUrl: 'https://instagram.com/p/C9kL872p00',
  },
  {
    id: 'post_3',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop&q=80',
    likesCount: 890,
    commentsCount: 42,
    caption: 'سهرة وفعالية مميزة مع الأصدقاء 🎉 #رياض #توب',
    postUrl: 'https://instagram.com/p/C5mM290q99',
  },
];

const PRESET_COMMENTS_AR = [
  'ماشاء الله محتوى ممتاز 🔥',
  'روعة وفخامة! 👏',
  'منشور بطل أحييك ❤️',
  'إبداع لا يتوقف ✨',
  'Top Quality Post! 🔥',
];

export const GetLikesComments: React.FC<GetLikesCommentsProps> = ({
  user,
  language,
  onDeductCoins,
  onCreateOrder,
  onOpenStore,
}) => {
  const [activeTab, setActiveTab] = useState<'likes' | 'comments'>('likes');
  const [postUrl, setPostUrl] = useState('https://instagram.com/p/C3xY901m12');
  const [selectedPost, setSelectedPost] = useState<IgPost>(SAMPLE_POSTS[0]);

  // Likes options
  const [likesCount, setLikesCount] = useState<number>(200);

  // Comments options
  const [customCommentsText, setCustomCommentsText] = useState(PRESET_COMMENTS_AR.join('\n'));

  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateLikesCost = (count: number) => count * 4; // 4 coins per like
  const calculateCommentsCost = (commentsList: string[]) => commentsList.filter((c) => c.trim()).length * 20; // 20 coins per comment

  const activeCommentsList = customCommentsText.split('\n').filter((c) => c.trim());

  const activeCost =
    activeTab === 'likes' ? calculateLikesCost(likesCount) : calculateCommentsCost(activeCommentsList);

  const handleOrderConfirm = () => {
    playTapSound();
    setErrorMsg(null);
    setOrderSuccessMsg(null);

    if (user.coins < activeCost) {
      setErrorMsg(
        language === 'ar'
          ? `رصيدك غير كافٍ! تحتاج إلى ${activeCost.toLocaleString()} نقطة (رصيدك الحالي: ${user.coins.toLocaleString()} نقطة)`
          : `Insufficient coins! Required: ${activeCost.toLocaleString()} coins`
      );
      return;
    }

    const success = onDeductCoins(activeCost);
    if (!success) return;

    playSuccessFanfare();

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      type: activeTab,
      targetUsername: 'instagram_user',
      postUrl,
      postImage: selectedPost.imageUrl,
      customComments: activeTab === 'comments' ? activeCommentsList : undefined,
      totalQuantity: activeTab === 'likes' ? likesCount : activeCommentsList.length,
      deliveredQuantity: 0,
      costInCoins: activeCost,
      status: 'active',
      createdAt: new Date().toISOString(),
      estimatedDeliverySpeed: 'turbo',
    };

    onCreateOrder(newOrder);

    setOrderSuccessMsg(
      language === 'ar'
        ? `تم إرسال الطلب بنجاح! جاري تنفيذ ${
            activeTab === 'likes' ? `${likesCount} لايك` : `${activeCommentsList.length} تعليق`
          }`
        : `Order created successfully for ${
            activeTab === 'likes' ? `${likesCount} likes` : `${activeCommentsList.length} comments`
          }`
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Header (Likes vs Comments) */}
      <div className="flex rounded-2xl bg-[#0a0a0a] border border-white/10 p-1.5">
        <button
          onClick={() => {
            playTapSound();
            setActiveTab('likes');
          }}
          className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'likes'
              ? 'bg-gradient-to-r from-[#dc2743] to-[#cc2366] text-white shadow-xl shadow-pink-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'likes' ? 'fill-white' : ''}`} />
          <span>{language === 'ar' ? 'طلب لايكات للمنشور' : 'Get Likes'}</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('comments');
          }}
          className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'comments'
              ? 'bg-gradient-to-r from-[#dc2743] to-[#cc2366] text-white shadow-xl shadow-pink-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'ar' ? 'تعليقات عربية مخصصة' : 'Custom Comments'}</span>
        </button>
      </div>

      {/* Post Selection or URL Input */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Link className="w-4 h-4 text-pink-500" />
          <span>{language === 'ar' ? 'ضع رابط المنشور أو اختر من المعرض' : 'Post URL or Gallery'}</span>
        </h3>

        <div className="relative">
          <input
            type="text"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Gallery Posts Grid Preview */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {SAMPLE_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                playTapSound();
                setSelectedPost(post);
                setPostUrl(post.postUrl);
              }}
              className={`relative cursor-pointer rounded-xl overflow-hidden border transition-all ${
                selectedPost.id === post.id
                  ? 'ring-2 ring-pink-500 border-pink-500 scale-105 shadow-lg shadow-pink-500/20'
                  : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={post.imageUrl} alt="post" className="w-full h-24 sm:h-28 object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 p-1.5 flex items-center justify-between text-[10px] text-white">
                <span className="flex items-center gap-1 font-bold">
                  <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                  {post.likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-gray-300" />
                  {post.commentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Configuration */}
      {activeTab === 'likes' ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>{language === 'ar' ? 'اختر عدد اللايكات المطلوبة' : 'Choose Likes Count'}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[50, 100, 200, 500, 1000, 2500].map((count) => {
              const cost = calculateLikesCost(count);
              const isSelected = likesCount === count;
              return (
                <div
                  key={count}
                  onClick={() => {
                    playTapSound();
                    setLikesCount(count);
                  }}
                  className={`cursor-pointer rounded-xl p-3 border text-center transition-all ${
                    isSelected
                      ? 'bg-pink-500/10 border-pink-500 text-white shadow-md'
                      : 'bg-[#050505] border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-extrabold text-lg text-white">+{count}</div>
                  <div className="text-[11px] text-amber-400 font-semibold">{cost.toLocaleString()} {language === 'ar' ? 'نقطة' : 'coins'}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Custom Comments Area */
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-pink-500" />
              <span>{language === 'ar' ? 'اكتب التعليقات (تعليق واحد في كل سطر)' : 'Write Comments (One per line)'}</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              {activeCommentsList.length} {language === 'ar' ? 'تعليقات' : 'comments'} = {activeCost} {language === 'ar' ? 'نقطة' : 'coins'}
            </span>
          </div>

          <textarea
            rows={5}
            value={customCommentsText}
            onChange={(e) => setCustomCommentsText(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-sans"
            placeholder={language === 'ar' ? 'ماشاء الله 🔥\nمنشور رائع ❤️' : 'Great post!\nAwesome vibe!'}
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
              {language === 'ar' ? 'نماذج جاهزة:' : 'Presets:'}
            </span>
            <button
              onClick={() => setCustomCommentsText(PRESET_COMMENTS_AR.join('\n'))}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 font-semibold"
            >
              {language === 'ar' ? 'تعليقات عربية فخمة 🇸🇦' : 'Arab Praise Pack'}
            </button>
            <button
              onClick={() =>
                setCustomCommentsText('Great picture! 🔥\nAwesome content ❤️\nLove this post! ✨\nSuper cool vibe!')
              }
              className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 font-semibold"
            >
              {language === 'ar' ? 'حزمة إنجليزية 🇬🇧' : 'English Pack'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation & Execution */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
            <button
              onClick={onOpenStore}
              className="px-2.5 py-1 bg-amber-400 text-black font-bold rounded-lg"
            >
              {language === 'ar' ? 'شراء نقاط' : 'Buy Coins'}
            </button>
          </div>
        )}

        {orderSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
        )}

        <button
          onClick={handleOrderConfirm}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-black text-base shadow-2xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Zap className="w-5 h-5 fill-current text-white" />
          <span>
            {language === 'ar'
              ? `تأكيد الطلب (${activeCost.toLocaleString()} نقطة)`
              : `Confirm Order (${activeCost.toLocaleString()} Coins)`}
          </span>
        </button>
      </div>
    </div>
  );
};
