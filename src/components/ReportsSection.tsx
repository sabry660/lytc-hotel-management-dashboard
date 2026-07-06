import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Download, Printer, Filter, Search, Plus, X, Save, BarChart3, TrendingUp,
  Calendar, Users, DollarSign, BedDouble, Coffee, Wrench, Sparkles, Award,
  CheckCircle2, AlertCircle, Clock, Eye, Share2, FileSpreadsheet, FileDown
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'occupancy' | 'revenue' | 'guests' | 'housekeeping' | 'restaurant' | 'staff' | 'marketing';
  dateRange: string;
  generatedAt: string;
  status: 'ready' | 'generating';
  size: string;
}

interface ReportsSectionProps {
  // Props can be added later for data integration
}

export default function ReportsSection({ }: ReportsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'occupancy' | 'revenue' | 'guests' | 'housekeeping' | 'restaurant' | 'staff' | 'marketing'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo data for reports
  const reports: Report[] = [
    { id: '1', name: 'تقرير الإشغال الشهري', type: 'occupancy', dateRange: 'يناير 2026', generatedAt: 'منذ يوم', status: 'ready', size: '2.4 MB' },
    { id: '2', name: 'تقرير الإيرادات الربع سنوي', type: 'revenue', dateRange: 'Q4 2025', generatedAt: 'منذ 3 أيام', status: 'ready', size: '3.1 MB' },
    { id: '3', name: 'تحليل النزلاء', type: 'guests', dateRange: 'ديسمبر 2025', generatedAt: 'منذ أسبوع', status: 'ready', size: '1.8 MB' },
    { id: '4', name: 'تقرير النظافة', type: 'housekeeping', dateRange: 'يناير 2026', generatedAt: 'منذ يومين', status: 'ready', size: '1.2 MB' },
    { id: '5', name: 'تقرير المطعم', type: 'restaurant', dateRange: 'يناير 2026', generatedAt: 'منذ 4 أيام', status: 'ready', size: '2.0 MB' },
    { id: '6', name: 'تقرير الموظفين', type: 'staff', dateRange: 'يناير 2026', generatedAt: 'منذ أسبوع', status: 'ready', size: '1.5 MB' },
    { id: '7', name: 'تقرير التسويق', type: 'marketing', dateRange: 'Q4 2025', generatedAt: 'منذ أسبوعين', status: 'ready', size: '2.8 MB' },
  ];

  const filteredReports = reports.filter(report => {
    const typeMatch = filter === 'all' || report.type === filter;
    const searchMatch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'occupancy': return <BedDouble size={14} className="text-blue-400" />;
      case 'revenue': return <DollarSign size={14} className="text-emerald-400" />;
      case 'guests': return <Users size={14} className="text-purple-400" />;
      case 'housekeeping': return <Sparkles size={14} className="text-amber-400" />;
      case 'restaurant': return <Coffee size={14} className="text-pink-400" />;
      case 'staff': return <Award size={14} className="text-cyan-400" />;
      case 'marketing': return <TrendingUp size={14} className="text-orange-400" />;
    }
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'occupancy': return 'الإشغال';
      case 'revenue': return 'الإيرادات';
      case 'guests': return 'النزلاء';
      case 'housekeeping': return 'النظافة';
      case 'restaurant': return 'المطعم';
      case 'staff': return 'الموظفين';
      case 'marketing': return 'التسويق';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">مركز التقارير المتقدم</h1>
          <p className="text-gray-500 text-xs mt-1">إنشاء وإدارة وتصدير التقارير المختلفة</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <Plus size={15} />
          <span>تقرير جديد</span>
        </button>
      </div>

      {/* Quick Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="p-4 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200 text-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg">
              <BedDouble size={20} />
            </div>
            <span className="text-sm font-bold text-white">تقرير الإشغال</span>
          </div>
          <span className="text-xs text-gray-500">تحليل نسبة الإشغال للغرف والأجنحة</span>
        </button>

        <button className="p-4 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200 text-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-sm font-bold text-white">تقرير الإيرادات</span>
          </div>
          <span className="text-xs text-gray-500">تحليل الإيرادات والمصروفات</span>
        </button>

        <button className="p-4 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200 text-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-sm font-bold text-white">تقرير النزلاء</span>
          </div>
          <span className="text-xs text-gray-500">تحليل سلوكيات النزلاء</span>
        </button>

        <button className="p-4 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200 text-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <span className="text-sm font-bold text-white">تقرير شامل</span>
          </div>
          <span className="text-xs text-gray-500">تقرير شامل لجميع الأقسام</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">النوع:</span>
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            {['all', 'occupancy', 'revenue', 'guests', 'housekeeping', 'restaurant', 'staff', 'marketing'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === type ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'الكل' : getTypeLabel(type as any)}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث في التقارير..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 pr-10 text-xs text-white focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 pb-2">
                <th className="py-3 font-bold">اسم التقرير</th>
                <th className="py-3 font-bold">النوع</th>
                <th className="py-3 font-bold">الفترة الزمنية</th>
                <th className="py-3 font-bold">تاريخ الإنشاء</th>
                <th className="py-3 font-bold">الحجم</th>
                <th className="py-3 font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-white/[0.01] transition duration-150">
                  <td className="py-4 font-bold text-white">{report.name}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.type)}
                      <span className="text-gray-300">{getTypeLabel(report.type)}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-400">{report.dateRange}</td>
                  <td className="py-4 text-xs text-gray-500">{report.generatedAt}</td>
                  <td className="py-4 text-gray-400">{report.size}</td>
                  <td className="py-4 text-left">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                        title="عرض"
                      >
                        <Eye size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-emerald-500/30 transition"
                        title="تحميل PDF"
                      >
                        <FileDown size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-blue-500/30 transition"
                        title="تحميل Excel"
                      >
                        <FileSpreadsheet size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-purple-500/30 transition"
                        title="مشاركة"
                      >
                        <Share2 size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-amber-500/30 transition"
                        title="طباعة"
                      >
                        <Printer size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E6C587]">معاينة التقرير</h3>
              <button onClick={() => setSelectedReport(null)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">{selectedReport.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedReport.status === 'ready' ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30' : 'text-amber-400 bg-amber-950/20 border-amber-500/30'
                  }`}>
                    {selectedReport.status === 'ready' ? 'جاهز' : 'جاري الإنشاء'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">النوع:</span>
                    <span className="text-white">{getTypeLabel(selectedReport.type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">الفترة الزمنية:</span>
                    <span className="text-white">{selectedReport.dateRange}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">تاريخ الإنشاء:</span>
                    <span className="text-white">{selectedReport.generatedAt}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">الحجم:</span>
                    <span className="text-white">{selectedReport.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>تحميل PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 py-3 bg-[#121212] border border-gray-800 text-white font-bold rounded-xl hover:border-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={16} />
                  <span>تحميل Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
