import React from 'react';
import { Sparkles, Globe, Search, ArrowUpRight, Award, MessageSquare, Instagram, Heart } from 'lucide-react';

export default function MarketingSection() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">الحملات التسويقية والظهور الرقمي</h1>
          <p className="text-gray-500 text-xs mt-1">عرض أداء الحملات الرقمية، ومستوى إقبال الزوار على الموقع الإلكتروني وتتبع قنوات التواصل الاجتماعي.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">زوار الموقع لليوم:</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-white font-mono">14,250</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight size={10} />
              <span>+14%</span>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">تقييم خرائط جوجل للأعمال:</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-white font-mono">4.9 / 5.0</span>
            <span className="text-yellow-500 text-[10px] font-bold">⭐⭐⭐⭐⭐</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">التفاعل على إنستغرام:</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-white font-mono">245,000+</span>
            <span className="text-rose-400 text-xs">❤️</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">ترتيب محركات البحث SEO:</span>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-emerald-400 font-mono">المرتبة الأولى</span>
            <span className="text-[#D4AF37] text-[10px] font-bold">الرياض الفاخرة</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Performances */}
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
            <Award size={16} className="text-[#D4AF37]" />
            <span>الحملات التسويقية النشطة</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl space-y-2">
              <div className="flex justify-between">
                <h3 className="text-xs font-bold text-white">حملة أجنحة النخبة الصيفية الفاخرة</h3>
                <span className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 rounded text-[9px] font-bold">نشطة</span>
              </div>
              <p className="text-[11px] text-gray-400">تستهدف كبار الضيوف والوفود في الرياض والدمام وجدة.</p>
              <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                <span>مرات الظهور: <strong className="text-white font-mono">1.2M</strong></span>
                <span>الحجوزات الناتجة: <strong className="text-[#D4AF37] font-mono">45</strong></span>
              </div>
            </div>

            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl space-y-2">
              <div className="flex justify-between">
                <h3 className="text-xs font-bold text-white">حملة عطلات نهاية الأسبوع الرومانسية</h3>
                <span className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 rounded text-[9px] font-bold">نشطة</span>
              </div>
              <p className="text-[11px] text-gray-400">تستهدف الأزواج لخدمات السبا الحصرية والعشاء الملكي الخاص.</p>
              <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                <span>مرات الظهور: <strong className="text-white font-mono">840K</strong></span>
                <span>الحجوزات الناتجة: <strong className="text-[#D4AF37] font-mono">29</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Social media stats */}
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
            <Instagram size={16} className="text-blue-400" />
            <span>قنوات التواصل الاجتماعي التابعة لـ LYTC</span>
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[#121212] border border-gray-800 rounded-xl">
              <div>
                <span className="text-xs font-bold text-white block">حساب إنستغرام الرئيسي</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">@lytc.palace</span>
              </div>
              <span className="text-xs font-mono font-black text-[#E6C587]">184K متابع</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#121212] border border-gray-800 rounded-xl">
              <div>
                <span className="text-xs font-bold text-white block">منصة إكس العالمية</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">@lytc_palace</span>
              </div>
              <span className="text-xs font-mono font-black text-[#E6C587]">65K متابع</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#121212] border border-gray-800 rounded-xl">
              <div>
                <span className="text-xs font-bold text-white block">قناة اليوتيوب الرسمية</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">تغطيات الغرف والمنتجع</span>
              </div>
              <span className="text-xs font-mono font-black text-[#E6C587]">42K مشترك</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
