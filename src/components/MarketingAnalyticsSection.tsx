import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Globe, Facebook, Instagram, MessageCircle, Mail, 
  Search, Filter, Download, BarChart3, PieChart, LineChart,
  Users, MousePointerClick, Eye, ArrowUpRight, ArrowDownRight,
  DollarSign, Target, Calendar, Award, Share2, Heart, MessageSquare,
  Youtube, Twitter, ExternalLink, CheckCircle, AlertCircle, Zap,
  Flame, Sparkles, Star, Clock, Activity, MapPin, Phone, Mail as MailIcon
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function MarketingAnalyticsSection() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'instagram' | 'facebook' | 'tiktok' | 'x'>('all');

  // Website Analytics Data
  const websiteData = [
    { date: 'يناير', visitors: 8500, pageViews: 24500, bounceRate: 42, avgDuration: 185 },
    { date: 'فبراير', visitors: 9200, pageViews: 26800, bounceRate: 40, avgDuration: 198 },
    { date: 'مارس', visitors: 10800, pageViews: 31500, bounceRate: 38, avgDuration: 215 },
    { date: 'أبريل', visitors: 11500, pageViews: 33800, bounceRate: 37, avgDuration: 222 },
    { date: 'مايو', visitors: 12100, pageViews: 35200, bounceRate: 36, avgDuration: 235 },
    { date: 'يونيو', visitors: 12500, pageViews: 36800, bounceRate: 35, avgDuration: 248 }
  ];

  // Traffic Sources Data
  const trafficSourcesData = [
    { name: 'الموقع المباشر', visitors: 4500, percentage: 36, color: '#D4AF37' },
    { name: 'Google Search', visitors: 3800, percentage: 30, color: '#4285F4' },
    { name: 'Instagram', visitors: 2200, percentage: 18, color: '#E4405F' },
    { name: 'Facebook', visitors: 1200, percentage: 10, color: '#1877F2' },
    { name: 'Booking.com', visitors: 800, percentage: 6, color: '#003580' }
  ];

  // Social Media Performance
  const socialMediaData = [
    { platform: 'Instagram', followers: 45000, engagement: 4.8, reach: 125000, posts: 48, avgLikes: 1250, avgComments: 85 },
    { platform: 'Facebook', followers: 32000, engagement: 3.2, reach: 89000, posts: 36, avgLikes: 890, avgComments: 62 },
    { platform: 'TikTok', followers: 28000, engagement: 6.5, reach: 180000, posts: 24, avgLikes: 2100, avgComments: 145 },
    { platform: 'X (Twitter)', followers: 15000, engagement: 2.8, reach: 45000, posts: 72, avgLikes: 320, avgComments: 28 }
  ];

  // Campaign Performance
  const campaignData = [
    { name: 'رمضان الفاخر', platform: 'instagram', status: 'completed', budget: 25000, spent: 24800, conversions: 156, roi: 145 },
    { name: 'صيف 2026', platform: 'facebook', status: 'active', budget: 30000, spent: 18500, conversions: 89, roi: 128 },
    { name: 'عروض السبا', platform: 'tiktok', status: 'active', budget: 20000, spent: 12000, conversions: 67, roi: 167 },
    { name: 'حجوزات الشركات', platform: 'email', status: 'scheduled', budget: 15000, spent: 0, conversions: 0, roi: 0 },
    { name: 'العودة للمدارس', platform: 'instagram', status: 'scheduled', budget: 18000, spent: 0, conversions: 0, roi: 0 }
  ];

  // SEO Metrics
  const seoData = [
    { keyword: 'فنادق فاخرة الرياض', rank: 3, volume: 5400, change: 2 },
    { keyword: 'جناح ملكي الرياض', rank: 1, volume: 2900, change: 0 },
    { keyword: 'سبا فاخر السعودية', rank: 5, volume: 4100, change: -1 },
    { keyword: 'مطعم راقي الرياض', rank: 2, volume: 1800, change: 1 },
    { keyword: 'فندق 5 نجوم', rank: 4, volume: 8900, change: 3 },
    { keyword: 'إقامة عائلية فاخرة', rank: 6, volume: 2200, change: -2 }
  ];

  // Conversion Funnel
  const conversionFunnelData = [
    { stage: 'زيارات الموقع', value: 12500, rate: 100 },
    { stage: 'تصفح الغرف', value: 8900, rate: 71 },
    { stage: 'عرض الأسعار', value: 4500, rate: 36 },
    { stage: 'بدء الحجز', value: 2800, rate: 22 },
    { stage: 'إتمام الحجز', value: 1650, rate: 13 }
  ];

  const COLORS = ['#D4AF37', '#1D4ED8', '#10B981', '#6B7280', '#EC4899', '#8B5CF6', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121212] border border-[#D4AF37]/30 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString('ar-SA')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">تحليلات التسويق الرقمي</h1>
          <p className="text-gray-500 text-xs mt-1">مؤشرات أداء شاملة للموقع الإلكتروني، السوشيال ميديا، SEO، والحملات التسويقية.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#121212] border border-gray-800 rounded-xl p-1">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === range
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === '7d' ? '7 أيام' : range === '30d' ? '30 يوم' : range === '90d' ? '90 يوم' : 'سنة'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-700 transition-all duration-300 text-sm">
            <Download size={16} />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">زيارات الموقع</span>
            <div className="text-lg font-bold text-white font-mono">12,500</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <Eye size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">معدل التحويل</span>
            <div className="text-lg font-bold text-white font-mono">13.2%</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
            <MousePointerClick size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">متابعي Instagram</span>
            <div className="text-lg font-bold text-white font-mono">45K</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <Instagram size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-pink-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">معدل التفاعل</span>
            <div className="text-lg font-bold text-white font-mono">4.8%</div>
          </div>
          <div className="p-2 bg-pink-950/20 text-pink-400 rounded-lg mt-2">
            <Heart size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-cyan-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">درجة SEO</span>
            <div className="text-lg font-bold text-white font-mono">87/100</div>
          </div>
          <div className="p-2 bg-cyan-950/20 text-cyan-400 rounded-lg mt-2">
            <Search size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">ROI الحملات</span>
            <div className="text-lg font-bold text-white font-mono">147%</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <DollarSign size={16} />
          </div>
        </div>
      </div>

      {/* Website Analytics Chart */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">أداء الموقع الإلكتروني</h3>
        <div className="w-full" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={websiteData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#D4AF37" 
                fill="#D4AF37" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="الزوار"
              />
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="المشاهدات"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">مصادر الزيارات</h3>
          <div className="w-full" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="visitors"
                  label={(entry) => `${entry.name} (${entry.percentage}%)`}
                  labelLine={false}
                  labelStyle={{ fontSize: '9px', fill: '#9CA3AF' }}
                >
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">قمع التحويل</h3>
          <div className="w-full" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionFunnelData} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis type="number" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis dataKey="stage" type="category" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} name="الزوار" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Social Media Performance */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">أداء السوشيال ميديا</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المنصة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المتابعين</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">معدل التفاعل</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الوصول</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المنشورات</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">متوسط الإعجابات</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">متوسط التعليقات</th>
              </tr>
            </thead>
            <tbody>
              {socialMediaData.map((platform, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {platform.platform === 'Instagram' && <Instagram size={16} className="text-pink-400" />}
                      {platform.platform === 'Facebook' && <Facebook size={16} className="text-blue-400" />}
                      {platform.platform === 'TikTok' && <MessageCircle size={16} className="text-cyan-400" />}
                      {platform.platform === 'X (Twitter)' && <Twitter size={16} className="text-gray-400" />}
                      <span className="text-sm text-white font-bold">{platform.platform}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white font-mono">{platform.followers.toLocaleString('ar-SA')}</td>
                  <td className="py-3 text-sm text-emerald-400 font-bold">{platform.engagement}%</td>
                  <td className="py-3 text-sm text-white font-mono">{platform.reach.toLocaleString('ar-SA')}</td>
                  <td className="py-3 text-sm text-white">{platform.posts}</td>
                  <td className="py-3 text-sm text-white font-mono">{platform.avgLikes.toLocaleString('ar-SA')}</td>
                  <td className="py-3 text-sm text-white font-mono">{platform.avgComments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">أداء الحملات التسويقية</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">اسم الحملة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المنصة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الحالة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الميزانية</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المصروف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">التحويلات</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">ROI</th>
              </tr>
            </thead>
            <tbody>
              {campaignData.map((campaign, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white font-bold">{campaign.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-[#121212] border border-gray-800 rounded-lg text-xs text-gray-300">
                      {campaign.platform}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      campaign.status === 'completed' 
                        ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30'
                        : campaign.status === 'active'
                        ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {campaign.status === 'completed' ? 'مكتملة' : campaign.status === 'active' ? 'نشطة' : 'مجدولة'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white font-mono">{campaign.budget.toLocaleString('ar-SA')} ريال</td>
                  <td className="py-3 text-sm text-white font-mono">{campaign.spent.toLocaleString('ar-SA')} ريال</td>
                  <td className="py-3 text-sm text-white font-mono">{campaign.conversions}</td>
                  <td className="py-3 text-sm text-emerald-400 font-bold">{campaign.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Keywords */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">كلمات SEO المفتاحية</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الكلمة المفتاحية</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الترتيب</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">حجم البحث</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">التغيير</th>
              </tr>
            </thead>
            <tbody>
              {seoData.map((keyword, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white font-bold">{keyword.keyword}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#E6C587] border border-[#D4AF37]/30 rounded-lg text-xs font-bold">
                      #{keyword.rank}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white font-mono">{keyword.volume.toLocaleString('ar-SA')}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {keyword.change > 0 ? (
                        <ArrowUpRight size={14} className="text-emerald-400" />
                      ) : keyword.change < 0 ? (
                        <ArrowDownRight size={14} className="text-red-400" />
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                      <span className={`text-sm font-bold ${keyword.change > 0 ? 'text-emerald-400' : keyword.change < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
