import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { Sparkles, Hash, UserCheck, Lightbulb, Copy, Check, Loader2, Send } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface AiGrowthAssistantProps {
  language: AppLanguage;
}

export const AiGrowthAssistant: React.FC<AiGrowthAssistantProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'hashtags' | 'bio' | 'tips'>('hashtags');
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const samplePrompts = {
    hashtags: [
      'هاشتاقات انستغرام متفاعلة لمجال الموضة والأزياء الخليجية 2026',
      'Top viral hashtags for Tech and AI startups',
      'هاشتاقات مطاعم وكافيهات الرياض والخليج لزيادة الوصول',
    ],
    bio: [
      'بايو لمصمم جرافيك وصانع محتوى تقني مع رابط واتساب',
      'Attractive bio for fitness trainer and lifestyle coach',
      'بايو متجر إلكتروني للملابس والمنتجات الفاخرة مع توصيل سريع',
    ],
    tips: [
      'كيف أحول المتابعين القادمين من توب فلو إلى متابعين متفاعلين ودائمين؟',
      'How to optimize post upload timing for maximum reach?',
      'خطة نشر أسبوعية زيادة تفاعل الريلز والستوري',
    ],
  };

  const handleGenerate = async (customPrompt?: string) => {
    playTapSound();
    const promptToUse = (customPrompt || inputPrompt).trim();
    if (!promptToUse) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/growth-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          type: activeTab,
          language,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setResult(
          language === 'ar'
            ? 'حدث خطأ في جلب البيانات من الذكاء الاصطناعي. الرجاء التأكد من إعداد المفتاح.'
            : 'Error connecting to AI service. Please verify Gemini API setup.'
        );
      }
    } catch (e: any) {
      setResult(
        language === 'ar'
          ? 'تعذر الاتصال بخادم الذكاء الاصطناعي حالياً.'
          : 'Could not connect to AI server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    playTapSound();
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {language === 'ar' ? 'مساعد النمو الذكي لانستغرام (Gemini AI)' : 'AI Instagram Growth Assistant'}
            </h2>
            <p className="text-xs text-gray-400">
              {language === 'ar'
                ? 'استخرج أقوى الهاشتاقات المتفاعلة وصمم بايو احترافي لزيادة وصول حسابك'
                : 'Generate viral hashtags, bio designs, and growth strategies powered by Gemini AI'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex rounded-xl bg-[#0a0a0a] border border-white/10 p-1">
        {[
          { id: 'hashtags', labelAr: 'مولد الهاشتاقات', labelEn: 'Viral Hashtags', icon: Hash },
          { id: 'bio', labelAr: 'تصميم البايو', labelEn: 'Bio Designer', icon: UserCheck },
          { id: 'tips', labelAr: 'نصائح النمو', labelEn: 'Growth Tips', icon: Lightbulb },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                playTapSound();
                setActiveTab(t.id as any);
                setResult(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-white/10 text-white shadow-md border border-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'ar' ? t.labelAr : t.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Input Box & Quick Prompts */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white block">
            {activeTab === 'hashtags'
              ? language === 'ar'
                ? 'حدد مجال حسابك لاستخراج الهاشتاقات:'
                : 'Enter your niche for hashtags:'
              : activeTab === 'bio'
              ? language === 'ar'
                ? 'صف حسابك لنصمم لك بايو مميز:'
                : 'Describe your account for a custom bio:'
              : language === 'ar'
              ? 'ما هو سؤالك عن زيادة تفاعل الانستغرام؟'
              : 'Ask a growth question:'}
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeTab === 'hashtags'
                  ? language === 'ar'
                    ? 'مثال: أزياء وموضة، تقنية، سيارات، مطاعم الرياض...'
                    : 'e.g. Fashion, Fitness, Tech, Dubai Foodie...'
                  : language === 'ar'
                  ? 'مثال: مصمم جرافيك، متجر إلكتروني، صانع محتوى...'
                  : 'e.g. Graphic Designer, E-commerce Store...'
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#cc2366] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-pink-600/30 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{language === 'ar' ? 'توليد بالذكاء' : 'Generate'}</span>
            </button>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-gray-400 font-bold block">
            {language === 'ar' ? '💡 اقتراحات سريعة للبدء:' : '💡 Quick Presets:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts[activeTab].map((promptText, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputPrompt(promptText);
                  handleGenerate(promptText);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors text-right font-medium"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Output Card */}
      {result && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {language === 'ar' ? 'النتيجة من الذكاء الاصطناعي:' : 'AI Generation Output:'}
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ النص' : 'Copy Text')}</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-line p-3.5 bg-[#050505] rounded-xl border border-white/5">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
