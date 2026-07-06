import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Layout, Image, Type, Settings, Save, Eye, Edit, Trash2, Plus, X,
  Search, Filter, Download, Printer, BarChart3, TrendingUp, Star, Award,
  CheckCircle2, AlertCircle, FileText, Link, Smartphone, Monitor
} from 'lucide-react';

interface CMSContent {
  id: string;
  title: string;
  type: 'page' | 'room' | 'amenity' | 'gallery' | 'blog';
  status: 'published' | 'draft' | 'archived';
  lastUpdated: string;
  views: number;
}

interface WebsiteCMSProps {
  // Props can be added later for data integration
}

export default function WebsiteCMS({ }: WebsiteCMSProps) {
  const [viewMode, setViewMode] = useState<'pages' | 'rooms' | 'amenities' | 'gallery' | 'seo'>('pages');
  const [selectedContent, setSelectedContent] = useState<CMSContent | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Demo data for CMS content
  const cmsContent: CMSContent[] = [
    { id: '1', title: 'الصفحة الرئيسية', type: 'page', status: 'published', lastUpdated: 'منذ ساعة', views: 1250 },
    { id: '2', title: 'صفحة الغرف والأجنحة', type: 'page', status: 'published', lastUpdated: 'منذ 3 ساعات', views: 890 },
    { id: '3', title: 'صفحة المرافق والخدمات', type: 'page', status: 'published', lastUpdated: 'منذ يوم', views: 650 },
    { id: '4', title: 'بنتهاوس فاخر الملكي', type: 'room', status: 'published', lastUpdated: 'منذ يومين', views: 420 },
    { id: '5', title: 'جناح ديلوكس البحري', type: 'room', status: 'published', lastUpdated: 'منذ يومين', views: 380 },
    { id: '6', title: 'المسبح الخارجي', type: 'amenity', status: 'published', lastUpdated: 'منذ 3 أيام', views: 290 },
    { id: '7', title: 'مركز اللياقة البدنية', type: 'amenity', status: 'published', lastUpdated: 'منذ 4 أيام', views: 210 },
    { id: '8', title: 'معرض الصور', type: 'gallery', status: 'published', lastUpdated: 'منذ أسبوع', views: 560 },
    { id: '9', title: 'مقال: تجربة الضيافة الملكية', type: 'blog', status: 'draft', lastUpdated: 'منذ أسبوعين', views: 0 },
  ];

  const filteredContent = cmsContent.filter(content => {
    const statusMatch = filter === 'all' || content.status === filter;
    const searchMatch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status: CMSContent['status']) => {
    switch (status) {
      case 'published': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'draft': return 'text-amber-400 bg-amber-950/20 border-amber-500/30';
      case 'archived': return 'text-gray-400 bg-gray-900 border-gray-700';
    }
  };

  const getStatusLabel = (status: CMSContent['status']) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      case 'archived': return 'أرشيف';
    }
  };

  const getTypeIcon = (type: CMSContent['type']) => {
    switch (type) {
      case 'page': return <Layout size={14} className="text-blue-400" />;
      case 'room': return <Monitor size={14} className="text-purple-400" />;
      case 'amenity': return <Star size={14} className="text-amber-400" />;
      case 'gallery': return <Image size={14} className="text-emerald-400" />;
      case 'blog': return <FileText size={14} className="text-pink-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">نظام إدارة محتوى الموقع</h1>
          <p className="text-gray-500 text-xs mt-1">إدارة وتحديث محتوى موقع الفندق، الصفحات، الغرف، والمرافق</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <Plus size={15} />
          <span>محتوى جديد</span>
        </button>
      </div>

      {/* View Mode Toggles */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
        {[
          { id: 'pages', label: 'الصفحات', icon: <Layout size={14} /> },
          { id: 'rooms', label: 'الغرف', icon: <Monitor size={14} /> },
          { id: 'amenities', label: 'المرافق', icon: <Star size={14} /> },
          { id: 'gallery', label: 'المعرض', icon: <Image size={14} /> },
          { id: 'seo', label: 'التحسينات', icon: <TrendingUp size={14} /> }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === mode.id ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي الصفحات</span>
            <div className="text-lg font-bold text-white font-mono">{cmsContent.filter(c => c.type === 'page').length}</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <Layout size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">المحتوى المنشور</span>
            <div className="text-lg font-bold text-white font-mono">{cmsContent.filter(c => c.status === 'published').length}</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">المسودات</span>
            <div className="text-lg font-bold text-white font-mono">{cmsContent.filter(c => c.status === 'draft').length}</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <FileText size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي المشاهدات</span>
            <div className="text-lg font-bold text-white font-mono">{cmsContent.reduce((sum, c) => sum + c.views, 0).toLocaleString('ar-SA')}</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Eye size={16} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">الحالة:</span>
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            {['all', 'published', 'draft', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === status ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'الكل' : status === 'published' ? 'منشور' : status === 'draft' ? 'مسودة' : 'أرشيف'}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث في المحتوى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 pr-10 text-xs text-white focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Content List */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 pb-2">
                <th className="py-3 font-bold">العنوان</th>
                <th className="py-3 font-bold">النوع</th>
                <th className="py-3 font-bold">الحالة</th>
                <th className="py-3 font-bold">آخر تحديث</th>
                <th className="py-3 font-bold">المشاهدات</th>
                <th className="py-3 font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {filteredContent.map((content) => (
                <tr key={content.id} className="hover:bg-white/[0.01] transition duration-150">
                  <td className="py-4 font-bold text-white">{content.title}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(content.type)}
                      <span className="text-gray-300">{content.type}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(content.status)}`}>
                      {getStatusLabel(content.status)}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-gray-500">{content.lastUpdated}</td>
                  <td className="py-4 text-white font-mono">{content.views.toLocaleString('ar-SA')}</td>
                  <td className="py-4 text-left">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedContent(content)}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                        title="عرض"
                      >
                        <Eye size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                        title="تعديل"
                      >
                        <Edit size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-red-500/30 transition"
                        title="حذف"
                      >
                        <Trash2 size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO View */}
      {viewMode === 'seo' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">إعدادات تحسين محركات البحث (SEO)</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">عنوان الموقع</span>
                <span className="text-xs text-emerald-400">مُحسّن</span>
              </div>
              <div className="text-xs text-gray-500">ليتك للفنادق والمنتجعات الفاخرة - الرياض</div>
            </div>
            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">الوصف الميتا</span>
                <span className="text-xs text-emerald-400">مُحسّن</span>
              </div>
              <div className="text-xs text-gray-500">استمتع بأرقى تجربة ضيافة فاخرة في قلب الرياض مع ليتك للفنادق والمنتجعات</div>
            </div>
            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">الكلمات المفتاحية</span>
                <span className="text-xs text-amber-400">يتطلب تحسين</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['فندق فاخر الرياض', 'منتجعات سعودية', 'ضيافة ملكية', 'غرف فندقية'].map((keyword, idx) => (
                  <span key={idx} className="px-2 py-1 bg-[#090909] border border-gray-800 rounded text-xs text-gray-400">{keyword}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Preview Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E6C587]">معاينة المحتوى</h3>
              <button onClick={() => setSelectedContent(null)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div className="text-sm font-bold text-white mb-2">{selectedContent.title}</div>
                <div className="text-xs text-gray-500">النوع: {selectedContent.type}</div>
                <div className="text-xs text-gray-500">الحالة: {getStatusLabel(selectedContent.status)}</div>
                <div className="text-xs text-gray-500">المشاهدات: {selectedContent.views.toLocaleString('ar-SA')}</div>
              </div>
              <button
                onClick={() => setSelectedContent(null)}
                className="w-full py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
