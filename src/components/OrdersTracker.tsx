import React, { useState } from 'react';
import { AppLanguage, Order } from '../types';
import { ListOrdered, CheckCircle2, Clock, RefreshCw, Zap, Users, Heart, MessageSquare, ArrowUpRight } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface OrdersTrackerProps {
  orders: Order[];
  language: AppLanguage;
  onRefillOrder?: (orderId: string) => void;
}

export const OrdersTracker: React.FC<OrdersTrackerProps> = ({
  orders,
  language,
  onRefillOrder,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [refillMsg, setRefillMsg] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return o.status === 'active';
    if (filter === 'completed') return o.status === 'completed';
    return true;
  });

  const handleRefillClick = (orderId: string) => {
    playTapSound();
    if (onRefillOrder) onRefillOrder(orderId);
    setRefillMsg(
      language === 'ar'
        ? 'تم إرسال طلب إعادة التعبئة بنجاح! سيتم فحص الحساب وإكماله تلقائياً.'
        : 'Refill requested! Missing counts will be automatically replenished.'
    );
    setTimeout(() => setRefillMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-pink-500" />
          <h2 className="text-base font-bold text-white">
            {language === 'ar' ? 'سجل متابعة الطلبات المباشرة' : 'Live Orders Tracking'}
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex rounded-xl bg-[#050505] p-1 border border-white/10 text-xs font-semibold">
          {[
            { id: 'all', labelAr: 'جميع الطلبات', labelEn: 'All' },
            { id: 'active', labelAr: 'قيد التنفيذ', labelEn: 'Active' },
            { id: 'completed', labelAr: 'المكتملة', labelEn: 'Completed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                playTapSound();
                setFilter(f.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === f.id
                  ? 'bg-white/10 text-white font-bold border border-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? f.labelAr : f.labelEn}
            </button>
          ))}
        </div>
      </div>

      {refillMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{refillMsg}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
            <Clock className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              {language === 'ar' ? 'لا توجد طلبات في هذا القسم حالياً' : 'No orders found in this view'}
            </p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const percentage = Math.min(100, Math.round((ord.deliveredQuantity / ord.totalQuantity) * 100));

            return (
              <div
                key={ord.id}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-white/20 transition-colors shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    {ord.type === 'followers' && <Users className="w-4 h-4 text-pink-500" />}
                    {ord.type === 'likes' && <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />}
                    {ord.type === 'comments' && <MessageSquare className="w-4 h-4 text-amber-400" />}

                    <span className="font-bold text-white text-sm">
                      {ord.type === 'followers'
                        ? language === 'ar'
                          ? `طلب ${ord.totalQuantity.toLocaleString()} متابع`
                          : `${ord.totalQuantity.toLocaleString()} Followers Order`
                        : ord.type === 'likes'
                        ? language === 'ar'
                          ? `طلب ${ord.totalQuantity.toLocaleString()} لايك`
                          : `${ord.totalQuantity.toLocaleString()} Likes Order`
                        : language === 'ar'
                        ? `طلب ${ord.totalQuantity} تعليق مخصص`
                        : `${ord.totalQuantity} Comments Order`}
                    </span>

                    <span className="text-xs text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                      @{ord.targetUsername}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-bold">
                      {ord.costInCoins.toLocaleString()} {language === 'ar' ? 'نقطة' : 'coins'}
                    </span>

                    {ord.status === 'completed' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {language === 'ar' ? 'مكتمل 100%' : 'Completed'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" />
                        {language === 'ar' ? 'جاري الإرسال...' : 'In Progress...'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>
                      {language === 'ar'
                        ? `تم تسليم: ${ord.deliveredQuantity} من ${ord.totalQuantity}`
                        : `Delivered: ${ord.deliveredQuantity} / ${ord.totalQuantity}`}
                    </span>
                    <span className="text-pink-400 font-bold">{percentage}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-[#050505] rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#dc2743] to-[#cc2366] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Order Footer & Actions */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>
                    {language === 'ar' ? 'تاريخ الطلب:' : 'Created:'}{' '}
                    {new Date(ord.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                  </span>

                  <button
                    onClick={() => handleRefillClick(ord.id)}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{language === 'ar' ? 'طلب تعبئة تلقائية (Refill)' : 'Refill'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
