import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, Calendar, Clock, Award, Star, BarChart3, PieChart, 
  Download, Printer, Filter, DollarSign, Home, Bed, Heart, Target,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, X, FileText, Table
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AnalyticsSection() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  // Monthly Revenue Data
  const monthlyRevenueData = [
    { month: 'يناير', revenue: 180000, target: 200000 },
    { month: 'فبراير', revenue: 220000, target: 220000 },
    { month: 'مارس', revenue: 310000, target: 280000 },
    { month: 'أبريل', revenue: 290000, target: 300000 },
    { month: 'مايو', revenue: 380000, target: 350000 },
    { month: 'يونيو', revenue: 450000, target: 400000 },
    { month: 'يوليو', revenue: 520000, target: 450000 },
    { month: 'أغسطس', revenue: 480000, target: 480000 },
    { month: 'سبتمبر', revenue: 410000, target: 420000 },
    { month: 'أكتوبر', revenue: 390000, target: 400000 },
    { month: 'نوفمبر', revenue: 340000, target: 350000 },
    { month: 'ديسمبر', revenue: 580000, target: 500000 }
  ];

  // Occupancy Rate Data
  const occupancyData = [
    { month: 'يناير', occupancy: 65 },
    { month: 'فبراير', occupancy: 72 },
    { month: 'مارس', occupancy: 78 },
    { month: 'أبريل', occupancy: 75 },
    { month: 'مايو', occupancy: 82 },
    { month: 'يونيو', occupancy: 88 },
    { month: 'يوليو', occupancy: 92 },
    { month: 'أغسطس', occupancy: 90 },
    { month: 'سبتمبر', occupancy: 85 },
    { month: 'أكتوبر', occupancy: 80 },
    { month: 'نوفمبر', occupancy: 72 },
    { month: 'ديسمبر', occupancy: 95 }
  ];

  // Monthly Reservations Data
  const reservationsData = [
    { month: 'يناير', bookings: 45 },
    { month: 'فبراير', bookings: 54 },
    { month: 'مارس', bookings: 78 },
    { month: 'أبريل', bookings: 69 },
    { month: 'مايو', bookings: 92 },
    { month: 'يونيو', bookings: 110 },
    { month: 'يوليو', bookings: 125 },
    { month: 'أغسطس', bookings: 118 },
    { month: 'سبتمبر', bookings: 98 },
    { month: 'أكتوبر', bookings: 88 },
    { month: 'نوفمبر', bookings: 72 },
    { month: 'ديسمبر', bookings: 142 }
  ];

  // Booking Sources Data
  const bookingSourcesData = [
    { name: 'الموقع الرسمي', value: 45, color: '#D4AF37' },
    { name: 'Booking.com', value: 28, color: '#1D4ED8' },
    { name: 'مباشر', value: 17, color: '#10B981' },
    { name: 'وكالات', value: 10, color: '#6B7280' }
  ];

  // Room Types Data
  const roomTypesData = [
    { name: 'بنتهاوس فاخر', bookings: 35 },
    { name: 'جناح ملكي', bookings: 42 },
    { name: 'جناح ديلوكس', bookings: 58 },
    { name: 'غرفة بريميوم', bookings: 45 },
    { name: 'غرفة كلاسيك', bookings: 32 }
  ];

  // Services Data
  const servicesData = [
    { name: 'الخدمة الغرفائية', value: 35 },
    { name: 'السبا والمساج', value: 25 },
    { name: 'المطعم', value: 20 },
    { name: 'النقل', value: 12 },
    { name: 'أخرى', value: 8 }
  ];

  // New Executive Dashboard Charts Data
  
  // Monthly Revenue Comparison (Current Year vs Previous Year)
  const monthlyRevenueComparisonData = [
    { month: 'يناير', currentYear: 180000, previousYear: 150000 },
    { month: 'فبراير', currentYear: 220000, previousYear: 190000 },
    { month: 'مارس', currentYear: 310000, previousYear: 260000 },
    { month: 'أبريل', currentYear: 290000, previousYear: 245000 },
    { month: 'مايو', currentYear: 380000, previousYear: 320000 },
    { month: 'يونيو', currentYear: 450000, previousYear: 380000 },
    { month: 'يوليو', currentYear: 520000, previousYear: 440000 },
    { month: 'أغسطس', currentYear: 480000, previousYear: 410000 },
    { month: 'سبتمبر', currentYear: 410000, previousYear: 350000 },
    { month: 'أكتوبر', currentYear: 390000, previousYear: 330000 },
    { month: 'نوفمبر', currentYear: 340000, previousYear: 290000 },
    { month: 'ديسمبر', currentYear: 580000, previousYear: 490000 }
  ];

  // Annual Revenue Comparison (Last 5 Years)
  const annualRevenueData = [
    { year: '2022', revenue: 3200000 },
    { year: '2023', revenue: 3800000 },
    { year: '2024', revenue: 4200000 },
    { year: '2025', revenue: 4800000 },
    { year: '2026', revenue: 5850000 }
  ];

  // Occupancy Forecast (Next 6 Months)
  const occupancyForecastData = [
    { month: 'يوليو', actual: 92, forecast: 94 },
    { month: 'أغسطس', actual: 90, forecast: 91 },
    { month: 'سبتمبر', actual: 85, forecast: 88 },
    { month: 'أكتوبر', actual: 80, forecast: 82 },
    { month: 'نوفمبر', actual: 72, forecast: 75 },
    { month: 'ديسمبر', actual: 95, forecast: 97 }
  ];

  // Booking Lead Time (Days Before Arrival)
  const bookingLeadTimeData = [
    { leadTime: 'أقل من أسبوع', bookings: 15 },
    { leadTime: 'أسبوع - أسبوعين', bookings: 28 },
    { leadTime: 'أسبوعين - شهر', bookings: 45 },
    { leadTime: 'شهر - شهرين', bookings: 38 },
    { leadTime: 'شهرين - 3 أشهر', bookings: 22 },
    { leadTime: 'أكثر من 3 أشهر', bookings: 12 }
  ];

  // Cancellation Trends (Monthly)
  const cancellationTrendsData = [
    { month: 'يناير', cancellations: 8, bookings: 45 },
    { month: 'فبراير', cancellations: 6, bookings: 54 },
    { month: 'مارس', cancellations: 9, bookings: 78 },
    { month: 'أبريل', cancellations: 7, bookings: 69 },
    { month: 'مايو', cancellations: 11, bookings: 92 },
    { month: 'يونيو', cancellations: 8, bookings: 110 },
    { month: 'يوليو', cancellations: 12, bookings: 125 },
    { month: 'أغسطس', cancellations: 10, bookings: 118 },
    { month: 'سبتمبر', cancellations: 9, bookings: 98 },
    { month: 'أكتوبر', cancellations: 7, bookings: 88 },
    { month: 'نوفمبر', cancellations: 5, bookings: 72 },
    { month: 'ديسمبر', cancellations: 15, bookings: 142 }
  ];

  // Website Conversions (Funnel)
  const conversionFunnelData = [
    { stage: 'زيارات الموقع', visitors: 12500, conversion: 100 },
    { stage: 'صفحات الغرف', visitors: 8900, conversion: 71 },
    { stage: 'عرض الأسعار', visitors: 4500, conversion: 36 },
    { stage: 'بدء الحجز', visitors: 2800, conversion: 22 },
    { stage: 'إتمام الحجز', visitors: 1650, conversion: 13 }
  ];

  // KPI Cards Data
  const kpiData = [
    {
      title: 'إجمالي الإيرادات',
      value: '4,850,000',
      unit: 'ريال',
      change: 12.5,
      icon: DollarSign,
      color: '#D4AF37'
    },
    {
      title: 'معدل الإشغال',
      value: '82',
      unit: '%',
      change: 8.3,
      icon: Home,
      color: '#10B981'
    },
    {
      title: 'متوسط السعر اليومي',
      value: '2,150',
      unit: 'ريال',
      change: 5.2,
      icon: TrendingUp,
      color: '#3B82F6'
    },
    {
      title: 'متوسط مدة الإقامة',
      value: '3.2',
      unit: 'ليالي',
      change: -2.1,
      icon: Clock,
      color: '#8B5CF6'
    },
    {
      title: 'إجمالي الحجوزات',
      value: '982',
      unit: 'حجز',
      change: 15.8,
      icon: Calendar,
      color: '#EC4899'
    },
    {
      title: 'رضا الضيوف',
      value: '4.7',
      unit: '/5',
      change: 3.5,
      icon: Star,
      color: '#F59E0B'
    },
    {
      title: 'الحجوزات المباشرة',
      value: '62',
      unit: '%',
      change: 7.2,
      icon: Users,
      color: '#14B8A6'
    },
    {
      title: 'Booking.com',
      value: '28',
      unit: '%',
      change: -4.5,
      icon: Bed,
      color: '#6366F1'
    }
  ];

  const COLORS = ['#D4AF37', '#1D4ED8', '#10B981', '#6B7280', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'];

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

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">التحليلات ومؤشرات الأداء</h1>
          <p className="text-gray-500 text-xs mt-1">عرض الإحصائيات الشاملة، ومستويات الأداء والنمو المالي والتشغيلي لـ LYTC.</p>
        </div>

        {/* Date Range Filter & Export Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#121212] border border-gray-800 rounded-lg p-1">
            {[
              { value: '7d', label: '7 أيام' },
              { value: '30d', label: '30 يوم' },
              { value: '90d', label: '90 يوم' },
              { value: '1y', label: 'سنة' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value as any)}
                className={`px-4 py-2 rounded-md text-xs font-bold transition ${
                  dateRange === range.value
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#D4AF37]/30 transition"
            >
              <FileText size={14} />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#D4AF37]/30 transition"
            >
              <Table size={14} />
              <span>Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#D4AF37]/30 transition"
            >
              <Printer size={14} />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-5 hover:border-[#D4AF37]/30 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#121212] border border-gray-800">
                <kpi.icon size={18} className="text-[#D4AF37]" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {kpi.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                <span>{Math.abs(kpi.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{kpi.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-white">{kpi.value}</span>
                <span className="text-xs text-gray-500">{kpi.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Line Chart */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#E6C587] flex items-center gap-2">
              <TrendingUp size={14} className="text-[#D4AF37]" />
              <span className="hidden sm:inline">الإيرادات الشهرية</span>
              <span className="sm:hidden">الإيرادات</span>
            </h3>
            <span className="text-[10px] text-gray-500">محدثة في الوقت الفعلي</span>
          </div>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#D4AF37', strokeWidth: 2 }}
                  name="الإيرادات"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="الهدف"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Rate Area Chart */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#E6C587] flex items-center gap-2">
              <Home size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">معدل الإشغال</span>
              <span className="sm:hidden">الإشغال</span>
            </h3>
            <span className="text-[10px] text-gray-500">نسبة مئوية</span>
          </div>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="معدل الإشغال"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Sources Pie Chart */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#E6C587] flex items-center gap-2">
              <PieChart size={14} className="text-blue-400" />
              <span className="hidden sm:inline">مصادر الحجوزات</span>
              <span className="sm:hidden">المصادر</span>
            </h3>
          </div>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={bookingSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => entry.name}
                  labelLine={false}
                  labelStyle={{ fontSize: '10px', fill: '#9CA3AF' }}
                >
                  {bookingSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Reservations Bar Chart */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#E6C587] flex items-center gap-2">
              <Calendar size={14} className="text-pink-400" />
              <span className="hidden sm:inline">الحجوزات الشهرية</span>
              <span className="sm:hidden">الحجوزات</span>
            </h3>
            <span className="text-[10px] text-gray-500">عدد الحجوزات</span>
          </div>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservationsData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#EC4899" radius={[4, 4, 0, 0]} name="الحجوزات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Section */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">التحليلات التفصيلية</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Most Booked Room Types */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <Bed size={12} className="text-[#D4AF37]" />
              <span className="hidden sm:inline">الأكثر حجزاً حسب نوع الغرفة</span>
              <span className="sm:hidden">الغرف الأكثر حجزاً</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomTypesData} layout="horizontal" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis type="number" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} width={75} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" fill="#D4AF37" radius={[0, 4, 4, 0]} name="الحجوزات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Requested Services */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <Heart size={12} className="text-red-400" />
              <span className="hidden sm:inline">الخدمات الأكثر طلباً</span>
              <span className="sm:hidden">الخدمات</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => entry.name}
                    labelLine={false}
                    labelStyle={{ fontSize: '9px', fill: '#9CA3AF' }}
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { title: 'أداء الموظفين', score: 92, trend: '+5%' },
            { title: 'أداء التسويق', score: 78, trend: '+12%' },
            { title: 'رضا العملاء', score: 94, trend: '+3%' },
            { title: 'الكفاءة التشغيلية', score: 87, trend: '+8%' }
          ].map((metric, index) => (
            <div key={index} className="bg-[#121212] border border-gray-800 rounded-xl p-3 sm:p-4">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400">{metric.title}</span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400">{metric.trend}</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#D4AF37] to-[#E6C587] rounded-full"
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-base sm:text-lg font-black text-white">{metric.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Executive Analytics Charts */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6">التحليلات التنفيذية المتقدمة</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Comparison */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp size={12} className="text-[#D4AF37]" />
              <span className="hidden sm:inline">مقارنة الإيرادات الشهرية (السنة الحالية vs السنة الماضية)</span>
              <span className="sm:hidden">مقارنة الإيرادات الشهرية</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueComparisonData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="currentYear" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    dot={{ fill: '#D4AF37', strokeWidth: 2, r: 3 }}
                    name="السنة الحالية"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previousYear" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="السنة الماضية"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Annual Revenue Comparison */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <BarChart3 size={12} className="text-emerald-400" />
              <span className="hidden sm:inline">مقارنة الإيرادات السنوية (آخر 5 سنوات)</span>
              <span className="sm:hidden">مقارنة الإيرادات السنوية</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualRevenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="year" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Forecast */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <Target size={12} className="text-blue-400" />
              <span className="hidden sm:inline">توقع نسبة الإشغال (الأشهر الستة القادمة)</span>
              <span className="sm:hidden">توقع نسبة الإشغال</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyForecastData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    name="الفعلي"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="المتوقع"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Lead Time */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <Clock size={12} className="text-amber-400" />
              <span className="hidden sm:inline">مدة الحجز قبل الوصول</span>
              <span className="sm:hidden">مدة الحجز</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingLeadTimeData} layout="horizontal" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis type="number" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="leadTime" type="category" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} width={75} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" fill="#F59E0B" radius={[0, 4, 4, 0]} name="الحجوزات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cancellation Trends */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <ArrowDown size={12} className="text-red-400" />
              <span className="hidden sm:inline">اتجاهات الإلغاء الشهرية</span>
              <span className="sm:hidden">اتجاهات الإلغاء</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cancellationTrendsData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="cancellations" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="الإلغاءات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                    name="إجمالي الحجوزات"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Website Conversion Funnel */}
          <div className="min-h-[300px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
              <Users size={12} className="text-cyan-400" />
              <span className="hidden sm:inline">تحويلات الموقع الإلكتروني</span>
              <span className="sm:hidden">تحويلات الموقع</span>
            </h4>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionFunnelData} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis type="number" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="stage" type="category" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} width={75} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="visitors" fill="#06B6D4" radius={[0, 4, 4, 0]} name="الزوار" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
