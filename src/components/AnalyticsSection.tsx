import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Calendar, Clock, Award, Star, BarChart3, PieChart } from 'lucide-react';

export default function AnalyticsSection() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Seed monthly revenues data for elegant line/bar chart
  const MONTHLY_REVENUE = [
    { month: 'يناير', value: 180000, bookings: 45 },
    { month: 'فبراير', value: 220000, bookings: 54 },
    { month: 'مارس', value: 310000, bookings: 78 },
    { month: 'أبريل', value: 290000, bookings: 69 },
    { month: 'مايو', value: 380000, bookings: 92 },
    { month: 'يونيو', value: 450000, bookings: 110 }
  ];

  const BOOKING_SOURCES = [
    { label: 'الموقع الإلكتروني الرسمي لشركة ليتك', pct: 45, color: '#D4AF37' },
    { label: 'وكالات السفر الشريكة و Booking.com', pct: 28, color: '#1D4ED8' },
    { label: 'الاتصال المباشر والشركاء المؤسسين', pct: 17, color: '#10B981' },
    { label: 'الاستقبال الشخصي الفوري للضيوف', pct: 10, color: '#6B7280' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">التحليلات ومؤشرات الأداء</h1>
          <p className="text-gray-500 text-xs mt-1">عرض الإحصائيات الشاملة، ومستويات الأداء والنمو المالي والتشغيلي لـ LYTC.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic SVG Revenue Chart Panel */}
        <div className="lg:col-span-2 bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h3 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
              <BarChart3 size={16} className="text-[#D4AF37]" />
              <span>الإيرادات الشهرية ومعدلات نمو الحجوزات</span>
            </h3>
            <span className="text-[10px] text-gray-500">محدثة في الوقت الفعلي</span>
          </div>

          {/* Luxury Custom SVG Bar Chart */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[450px] relative h-64 pt-6 flex items-end justify-between px-4">
              {MONTHLY_REVENUE.map((data, idx) => {
                const maxVal = 450000;
                const barHeightPct = (data.value / maxVal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-1/6 relative group">
                    
                    {/* Floating tooltip */}
                    <div className="absolute -top-12 bg-black border border-[#D4AF37]/50 text-[#E6C587] text-[10px] font-mono font-bold py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-center">
                      <div>{data.value.toLocaleString('ar-SA')} ريال</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">{data.bookings} حجز ناجح</div>
                    </div>

                    {/* Animated Bar with Champagne Gold Gradient */}
                    <div 
                      className="w-10 sm:w-12 bg-gradient-to-t from-[#AA7B30]/30 to-[#D4AF37] hover:to-[#E6C587] rounded-t-lg transition-all duration-300 relative border-t border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.05)] cursor-pointer"
                      style={{ height: `${barHeightPct}%` }}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />

                    {/* X-Axis Label */}
                    <span className="text-[10px] font-bold text-gray-500 mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Booking Sources (Pie Chart visualization) */}
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h3 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
              <PieChart size={16} className="text-blue-400" />
              <span>مصادر وقنوات الحجوزات الواردة</span>
            </h3>
          </div>

          {/* Donut Chart representation */}
          <div className="flex justify-center items-center py-4 relative">
            <svg width="160" height="160" viewBox="0 0 40 40" className="transform -rotate-90">
              <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#121212" strokeWidth="4" />
              
              {/* website 45% */}
              <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#D4AF37" strokeWidth="4" 
                strokeDasharray="45 55" strokeDashoffset="0" />
                
              {/* agencies 28% */}
              <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#1D4ED8" strokeWidth="4" 
                strokeDasharray="28 72" strokeDashoffset="-45" />

              {/* direct calls 17% */}
              <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="4" 
                strokeDasharray="17 83" strokeDashoffset="-73" />

              {/* walkins 10% */}
              <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#6B7280" strokeWidth="4" 
                strokeDasharray="10 90" strokeDashoffset="-90" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs text-gray-500 font-bold">الموقع</span>
              <span className="text-sm font-black text-white font-mono">45%</span>
            </div>
          </div>

          {/* Legend list */}
          <div className="space-y-3">
            {BOOKING_SOURCES.map((src, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  <span className="text-gray-400 font-bold">{src.label}</span>
                </div>
                <span className="font-mono font-bold text-[#E6C587]">{src.pct}%</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
