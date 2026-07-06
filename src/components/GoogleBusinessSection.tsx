import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, BarChart3, Eye, MapPin, Phone, Globe, Star, Users, Clock, 
  Search, Filter, Download, Printer, Plus, X, Save, ArrowUpRight, ArrowDownRight,
  Calendar, CheckCircle2, AlertCircle, Navigation, ExternalLink
} from 'lucide-react';

interface GoogleBusinessSectionProps {
  // Props can be added later for data integration
}

export default function GoogleBusinessSection({ }: GoogleBusinessSectionProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Demo data for Google Business metrics
  const metrics = {
    totalViews: 15420,
    directRequests: 892,
    phoneCalls: 234,
    websiteClicks: 567,
    directionRequests: 345,
    averageRating: 4.7,
    totalReviews: 156,
    photos: 24
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">تحليلات Google Business</h1>
          <p className="text-gray-500 text-xs mt-1">مراقبة أداء ملف الفندق على Google Business وقياس التفاعل</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <ExternalLink size={15} />
          <span>فتح Google Business</span>
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
        {[
          { id: 'week', label: 'أسبوع' },
          { id: 'month', label: 'شهر' },
          { id: 'quarter', label: 'ربع سنوي' },
          { id: 'year', label: 'سنة' }
        ].map((range) => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              timeRange === range.id ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي المشاهدات</span>
            <div className="text-lg font-bold text-white font-mono">{metrics.totalViews.toLocaleString('ar-SA')}</div>
            <div className={`text-xs ${getChangeColor(12)} flex items-center gap-1`}>
              {getChangeIcon(12)}
              <span>12%</span>
            </div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <Eye size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">الطلبات المباشرة</span>
            <div className="text-lg font-bold text-white font-mono">{metrics.directRequests.toLocaleString('ar-SA')}</div>
            <div className={`text-xs ${getChangeColor(8)} flex items-center gap-1`}>
              {getChangeIcon(8)}
              <span>8%</span>
            </div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">مكالمات الهاتف</span>
            <div className="text-lg font-bold text-white font-mono">{metrics.phoneCalls.toLocaleString('ar-SA')}</div>
            <div className={`text-xs ${getChangeColor(15)} flex items-center gap-1`}>
              {getChangeIcon(15)}
              <span>15%</span>
            </div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <Phone size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">نقرات الموقع</span>
            <div className="text-lg font-bold text-white font-mono">{metrics.websiteClicks.toLocaleString('ar-SA')}</div>
            <div className={`text-xs ${getChangeColor(5)} flex items-center gap-1`}>
              {getChangeIcon(5)}
              <span>5%</span>
            </div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Globe size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-pink-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">طلبات الاتجاهات</span>
            <div className="text-lg font-bold text-white font-mono">{metrics.directionRequests.toLocaleString('ar-SA')}</div>
            <div className={`text-xs ${getChangeColor(10)} flex items-center gap-1`}>
              {getChangeIcon(10)}
              <span>10%</span>
            </div>
          </div>
          <div className="p-2 bg-pink-950/20 text-pink-400 rounded-lg mt-2">
            <Navigation size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-cyan-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">التقييم العام</span>
            <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
              {metrics.averageRating}
              <Star size={16} className="text-amber-400" />
            </div>
            <div className="text-xs text-gray-500">{metrics.totalReviews} مراجعة</div>
          </div>
          <div className="p-2 bg-cyan-950/20 text-cyan-400 rounded-lg mt-2">
            <Star size={16} />
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-[#E6C587] mb-4">اتجاهات الأداء</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-white">المشاهدات اليومية</span>
              <span className="text-xs text-emerald-400">+18%</span>
            </div>
            <div className="flex items-end gap-1 h-24">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 rounded-t transition"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>يناير</span>
              <span>ديسمبر</span>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-white">التفاعل</span>
              <span className="text-xs text-emerald-400">+12%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">نقرات الموقع</span>
                <span className="text-xs text-white font-bold">{metrics.websiteClicks}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">مكالمات الهاتف</span>
                <span className="text-xs text-white font-bold">{metrics.phoneCalls}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">طلبات الاتجاهات</span>
                <span className="text-xs text-white font-bold">{metrics.directionRequests}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Actions */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-[#E6C587] mb-4">إجراءات العملاء</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-emerald-950/20 text-emerald-400 rounded-lg">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">مكالمات الهاتف</div>
              <div className="text-xs text-gray-500">{metrics.phoneCalls} مكالمة</div>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-blue-950/20 text-blue-400 rounded-lg">
              <Globe size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">نقرات الموقع</div>
              <div className="text-xs text-gray-500">{metrics.websiteClicks} نقرة</div>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-pink-950/20 text-pink-400 rounded-lg">
              <Navigation size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">طلبات الاتجاهات</div>
              <div className="text-xs text-gray-500">{metrics.directionRequests} طلب</div>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-amber-950/20 text-amber-400 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">الطلبات المباشرة</div>
              <div className="text-xs text-gray-500">{metrics.directRequests} طلب</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-[#E6C587] mb-4">النشاط الأخير</h3>
        <div className="space-y-3">
          {[
            { action: 'مشاهدة الملف', user: 'زائر جديد', time: 'منذ 5 دقائق', type: 'view' },
            { action: 'طلب اتجاهات', user: 'زائر من الرياض', time: 'منذ 15 دقيقة', type: 'direction' },
            { action: 'مكالمة هاتفية', user: 'عميل محتمل', time: 'منذ 30 دقيقة', type: 'call' },
            { action: 'نقرة على الموقع', user: 'زائر من جدة', time: 'منذ ساعة', type: 'website' },
            { action: 'مراجعة جديدة', user: 'السيدة نورة', time: 'منذ ساعتين', type: 'review' }
          ].map((activity, idx) => (
            <div key={idx} className="p-3 bg-[#121212] border border-gray-800 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'view' ? 'bg-emerald-950/20 text-emerald-400' :
                  activity.type === 'direction' ? 'bg-pink-950/20 text-pink-400' :
                  activity.type === 'call' ? 'bg-purple-950/20 text-purple-400' :
                  activity.type === 'website' ? 'bg-blue-950/20 text-blue-400' :
                  'bg-amber-950/20 text-amber-400'
                }`}>
                  {activity.type === 'view' ? <Eye size={16} /> :
                   activity.type === 'direction' ? <Navigation size={16} /> :
                   activity.type === 'call' ? <Phone size={16} /> :
                   activity.type === 'website' ? <Globe size={16} /> :
                   <Star size={16} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.user}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
