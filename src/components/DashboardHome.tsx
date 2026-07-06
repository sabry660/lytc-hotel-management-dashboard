import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Calendar, BedDouble, Users, MessageSquare, Wrench, ShieldAlert, Sparkles, 
  Clock, CloudSun, Compass, UserCheck, CreditCard, ChevronLeft, Bell, Star, Heart,
  Activity, ArrowUpRight, ArrowDownRight, Coffee, Shirt, ConciergeBell
} from 'lucide-react';
import { Room, Reservation, Guest, ServiceRequest, HousekeepingTask, MaintenanceTicket, Invoice } from '../types';

interface DashboardHomeProps {
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  requests: ServiceRequest[];
  housekeeping: HousekeepingTask[];
  maintenance: MaintenanceTicket[];
  invoices: Invoice[];
  onNavigate: (tab: string) => void;
  onOpenQuickBook: () => void;
  onOpenQuickRequest: () => void;
}

export default function DashboardHome({
  rooms,
  reservations,
  guests,
  requests,
  housekeeping,
  maintenance,
  invoices,
  onNavigate,
  onOpenQuickBook,
  onOpenQuickRequest
}: DashboardHomeProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live real metrics
  const totalBookings = reservations.filter(r => r.status !== 'cancelled').length;
  const occupiedRoomsCount = rooms.filter(r => r.status === 'occupied').length;
  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const activeGuestsCount = reservations
    .filter(r => r.status === 'checked_in')
    .reduce((sum, r) => sum + r.adultCount + r.childrenCount, 0);

  const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
  const openMaintenanceCount = maintenance.filter(m => m.status === 'open' || m.status === 'assigned').length;

  // New Executive Dashboard KPIs
  const averageRoomRate = rooms.length > 0 
    ? rooms.reduce((sum, r) => sum + r.pricePerNight, 0) / rooms.length 
    : 0;
  
  const revPAR = availableRoomsCount > 0 
    ? totalRevenue / (rooms.length - occupiedRoomsCount) 
    : 0;

  const directBookings = reservations.filter(r => 
    r.bookingSource === 'direct' || !r.bookingSource
  ).length;

  const platformBookings = reservations.filter(r => 
    r.bookingSource && r.bookingSource !== 'direct'
  ).length;

  const cancellationRate = reservations.length > 0 
    ? (reservations.filter(r => r.status === 'cancelled').length / reservations.length) * 100 
    : 0;

  const averageGuestRating = 4.7; // Demo value - would come from actual ratings

  const pendingPayments = invoices
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingHousekeeping = housekeeping.filter(h => h.status !== 'completed').length;

  const restaurantRevenue = 45000; // Demo value
  const spaRevenue = 28000; // Demo value

  const vipGuestsArriving = guests.filter(g => g.isVIP).length;

  const websiteVisits = 12500; // Demo value
  const seoScore = 87; // Demo value
  const googleBusinessViews = 8900; // Demo value
  const instagramReach = 45000; // Demo value
  const unreadMessages = 23; // Demo value

  const latestReservations = [...reservations]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 4);

  const recentRequests = [...requests]
    .filter(req => req.status !== 'completed')
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Upper Welcoming Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#0c0c0c] via-[#121212] to-[#0a0a0a] border border-[#D4AF37]/15 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
        {/* Abstract Golden Circles Backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-48 h-48 bg-radial-gradient from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] tracking-widest font-extrabold uppercase bg-amber-950/40 border border-[#D4AF37]/30 text-[#E6C587] rounded-md">
              الفرع الرئيسي • الرياض
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-gray-500">النظام الفني متصل ومستقر</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#E6C587] tracking-tight">
            أهلاً بك مجدداً، الشيخ عبد الله
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            مستويات الإشغال والتشغيل في قصر ليتك الفاخر عند الحد الأعلى لليوم. جميع الأقسام والخدمات تعمل بكامل طاقتها الاستيعابية بنجاح.
          </p>
        </div>

        {/* Live Clock & Weather Widget */}
        <div className="flex items-center gap-6 bg-[#000000]/30 border border-gray-800 p-4 rounded-xl backdrop-blur-md relative z-10 self-stretch lg:self-auto justify-between lg:justify-start">
          <div className="text-left">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Clock size={14} className="text-[#D4AF37]" />
              <span>الوقت المحلي للرياض</span>
            </div>
            <div className="text-2xl font-black font-mono text-[#E6C587] tracking-widest mt-1">
              {time}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">الأحد، 5 يوليو 2026 م</div>
          </div>
          <div className="h-10 w-[1px] bg-gray-800" />
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-400 text-xs justify-end">
              <CloudSun size={15} className="text-[#D4AF37]" />
              <span>الطقس اليوم</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              42° م
            </div>
            <div className="text-[10px] text-yellow-500 mt-0.5">مشمس • رطوبة منخفضة</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Reservations */}
        <div className="p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-[#D4AF37]/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold">إجمالي الحجوزات النشطة</p>
              <h3 className="text-3xl font-black text-white mt-2 font-mono">{totalBookings}</h3>
            </div>
            <div className="p-3 bg-amber-950/20 text-[#D4AF37] rounded-xl border border-[#D4AF37]/10">
              <Calendar size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-400">
            <ArrowUpRight size={14} />
            <span className="font-bold">+12%</span>
            <span className="text-gray-600">مقارنة بالأسبوع الماضي</span>
          </div>
        </div>

        {/* KPI 2: Occupied Rooms */}
        <div className="p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-blue-500/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold">الغرف المشغولة الآن</p>
              <h3 className="text-3xl font-black text-white mt-2 font-mono">
                {occupiedRoomsCount} <span className="text-xs text-gray-500 font-sans">/ {rooms.length}</span>
              </h3>
            </div>
            <div className="p-3 bg-blue-950/20 text-blue-400 rounded-xl border border-blue-500/10">
              <BedDouble size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <span className="font-bold text-[#D4AF37]">
              {Math.round((occupiedRoomsCount / rooms.length) * 100)}%
            </span>
            <span className="text-gray-600">معدل الإشغال الإجمالي</span>
          </div>
        </div>

        {/* KPI 3: Occupied Rooms */}
        <div className="p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold">الغرف المتاحة للحجز</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-2 font-mono">
                {availableRoomsCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-950/20 text-emerald-400 rounded-xl border border-emerald-500/10">
              <UserCheck size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <span className="font-bold text-emerald-400">
              {rooms.filter(r => r.status === 'cleaning').length} غرف
            </span>
            <span className="text-gray-600">تحت التنظيف حالياً</span>
          </div>
        </div>

        {/* KPI 4: Financial Revenues */}
        <div className="p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-[#D4AF37]/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#D4AF37] to-[#AA7B30]" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-bold">إجمالي الإيرادات المباشرة</p>
              <h3 className="text-3xl font-black text-white mt-2 font-mono">
                {totalRevenue.toLocaleString('ar-SA')} <span className="text-xs text-[#D4AF37] font-sans">ريال</span>
              </h3>
            </div>
            <div className="p-3 bg-amber-950/20 text-[#D4AF37] rounded-xl border border-[#D4AF37]/10">
              <CreditCard size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-400">
            <ArrowUpRight size={14} />
            <span className="font-bold">+18.4%</span>
            <span className="text-gray-600">معدل الإيراد اليومي</span>
          </div>
        </div>
      </div>

      {/* Expanded Executive Dashboard KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Average Room Rate */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">متوسط سعر الغرفة</span>
            <div className="text-lg font-bold text-white font-mono">{Math.round(averageRoomRate)} ريال</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* RevPAR */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-cyan-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">الإيراد لكل غرفة متاحة</span>
            <div className="text-lg font-bold text-white font-mono">{Math.round(revPAR)} ريال</div>
          </div>
          <div className="p-2 bg-cyan-950/20 text-cyan-400 rounded-lg">
            <Activity size={16} />
          </div>
        </div>

        {/* Direct Bookings */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">الحجوزات المباشرة</span>
            <div className="text-lg font-bold text-white font-mono">{directBookings}</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg">
            <Calendar size={16} />
          </div>
        </div>

        {/* Platform Bookings */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">حجوزات المنصات</span>
            <div className="text-lg font-bold text-white font-mono">{platformBookings}</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg">
            <Compass size={16} />
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-red-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">معدل الإلغاء</span>
            <div className="text-lg font-bold text-white font-mono">{cancellationRate.toFixed(1)}%</div>
          </div>
          <div className="p-2 bg-red-950/20 text-red-400 rounded-lg">
            <ArrowDownRight size={16} />
          </div>
        </div>

        {/* Average Guest Rating */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-yellow-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">متوسط تقييم النزلاء</span>
            <div className="text-lg font-bold text-white font-mono">{averageGuestRating} <Star size={14} className="inline text-yellow-400" /></div>
          </div>
          <div className="p-2 bg-yellow-950/20 text-yellow-400 rounded-lg">
            <Star size={16} />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-orange-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">المدفوعات المستحقة</span>
            <div className="text-lg font-bold text-white font-mono">{pendingPayments.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-orange-950/20 text-orange-400 rounded-lg">
            <CreditCard size={16} />
          </div>
        </div>

        {/* Open Maintenance */}
        <button 
          onClick={() => onNavigate('الصيانة')}
          className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-pink-500/35 transition duration-200 w-full"
        >
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-gray-500">طلبات الصيانة المفتوحة</span>
            <div className="text-lg font-bold text-white font-mono">{openMaintenanceCount}</div>
          </div>
          <div className="p-2 bg-pink-950/20 text-pink-400 rounded-lg">
            <Wrench size={16} />
          </div>
        </button>

        {/* Pending Housekeeping */}
        <button 
          onClick={() => onNavigate('خدمة الغرف')}
          className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-teal-500/35 transition duration-200 w-full"
        >
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-gray-500">مهام النظافة المتبقية</span>
            <div className="text-lg font-bold text-white font-mono">{pendingHousekeeping}</div>
          </div>
          <div className="p-2 bg-teal-950/20 text-teal-400 rounded-lg">
            <Sparkles size={16} />
          </div>
        </button>

        {/* Restaurant Revenue */}
        <button 
          onClick={() => onNavigate('المطعم')}
          className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-amber-500/35 transition duration-200 w-full"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إيرادات المطعم</span>
            <div className="text-lg font-bold text-white font-mono">{restaurantRevenue.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg">
            <Coffee size={16} />
          </div>
        </button>

        {/* Spa Revenue */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-indigo-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إيرادات السبا</span>
            <div className="text-lg font-bold text-white font-mono">{spaRevenue.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-indigo-950/20 text-indigo-400 rounded-lg">
            <Heart size={16} />
          </div>
        </div>

        {/* VIP Guests Arriving */}
        <button 
          onClick={() => onNavigate('النزلاء')}
          className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-rose-500/35 transition duration-200 w-full"
        >
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-gray-500">الضيوف المهمون القادمين</span>
            <div className="text-lg font-bold text-white font-mono">{vipGuestsArriving}</div>
          </div>
          <div className="p-2 bg-rose-950/20 text-rose-400 rounded-lg">
            <ShieldAlert size={16} />
          </div>
        </button>

        {/* Weather */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-sky-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">حالة الطقس</span>
            <div className="text-lg font-bold text-white font-mono">42° م</div>
          </div>
          <div className="p-2 bg-sky-950/20 text-sky-400 rounded-lg">
            <CloudSun size={16} />
          </div>
        </div>

        {/* Website Visits */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-green-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">زيارات الموقع</span>
            <div className="text-lg font-bold text-white font-mono">{websiteVisits.toLocaleString('ar-SA')}</div>
          </div>
          <div className="p-2 bg-green-950/20 text-green-400 rounded-lg">
            <Activity size={16} />
          </div>
        </div>

        {/* SEO Score */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-lime-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">درجة SEO</span>
            <div className="text-lg font-bold text-white font-mono">{seoScore}/100</div>
          </div>
          <div className="p-2 bg-lime-950/20 text-lime-400 rounded-lg">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* Google Business Views */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-blue-600/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">مشاهدات Google Business</span>
            <div className="text-lg font-bold text-white font-mono">{googleBusinessViews.toLocaleString('ar-SA')}</div>
          </div>
          <div className="p-2 bg-blue-900/20 text-blue-400 rounded-lg">
            <Compass size={16} />
          </div>
        </div>

        {/* Instagram Reach */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-pink-600/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">وصول Instagram</span>
            <div className="text-lg font-bold text-white font-mono">{instagramReach.toLocaleString('ar-SA')}</div>
          </div>
          <div className="p-2 bg-pink-900/20 text-pink-400 rounded-lg">
            <Heart size={16} />
          </div>
        </div>

        {/* Unread Messages */}
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-red-600/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">محادثات غير مقروءة</span>
            <div className="text-lg font-bold text-white font-mono">{unreadMessages}</div>
          </div>
          <div className="p-2 bg-red-900/20 text-red-400 rounded-lg">
            <MessageSquare size={16} />
          </div>
        </div>
      </div>

      {/* KPI Secondary Stats Grid (Requests, Maintenance, Guests, Satisfaction) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mini KPI 1 */}
        <div className="p-5 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-gray-800 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs text-gray-500">النزلاء المقيمين الآن</span>
            <div className="text-xl font-bold text-white font-mono">{activeGuestsCount} نزيل</div>
          </div>
          <div className="p-2.5 bg-gray-800/40 text-blue-400 rounded-lg">
            <Users size={18} />
          </div>
        </div>

        {/* Mini KPI 2 */}
        <div className="p-5 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-gray-800 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs text-gray-500">الطلبات الجديدة المعلقة</span>
            <div className="text-xl font-bold text-white font-mono">
              {pendingRequestsCount} <span className="text-xs text-gray-500 font-sans">طلب</span>
            </div>
          </div>
          <div className="p-2.5 bg-gray-800/40 text-amber-500 rounded-lg">
            <MessageSquare size={18} />
          </div>
        </div>

        {/* Mini KPI 3 */}
        <div className="p-5 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-gray-800 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs text-gray-500">بلاغات الصيانة المفتوحة</span>
            <div className="text-xl font-bold text-white font-mono">
              {openMaintenanceCount} <span className="text-xs text-gray-500 font-sans">بلاغ</span>
            </div>
          </div>
          <div className="p-2.5 bg-gray-800/40 text-red-400 rounded-lg">
            <Wrench size={18} />
          </div>
        </div>

        {/* Mini KPI 4 */}
        <div className="p-5 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-gray-800 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs text-gray-500">معدل رضا النزلاء الإجمالي</span>
            <div className="text-xl font-bold text-[#E6C587] font-mono">98.6%</div>
          </div>
          <div className="p-2.5 bg-amber-950/15 text-[#D4AF37] rounded-lg border border-[#D4AF37]/5">
            <Star size={18} className="fill-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Main Panel: Tables & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Guests & Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Reservations Panel */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#E6C587] flex items-center gap-2">
                <Calendar size={18} />
                <span>أحدث الحجوزات المسجلة</span>
              </h2>
              <button 
                onClick={() => onNavigate('الحجوزات')}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ChevronLeft size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 pb-2">
                    <th className="py-3 font-bold">النزيل</th>
                    <th className="py-3 font-bold">رقم الغرفة</th>
                    <th className="py-3 font-bold">تاريخ الإقامة</th>
                    <th className="py-3 font-bold">الحالة</th>
                    <th className="py-3 font-bold text-left">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {latestReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition duration-150">
                      <td className="py-3.5 font-bold text-white">{res.guestName}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 bg-[#121212] border border-gray-800 rounded text-xs text-gray-300 font-mono">
                          {res.roomNumber}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-gray-400 font-mono">
                        {res.checkIn} ── {res.checkOut}
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          res.status === 'checked_in' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' :
                          res.status === 'checked_out' ? 'bg-gray-900 text-gray-400 border border-gray-800' :
                          'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/20'
                        }`}>
                          {res.status === 'checked_in' ? 'مقيم حالياً' :
                           res.status === 'checked_out' ? 'مغادر' :
                           'وصول متوقع'}
                        </span>
                      </td>
                      <td className="py-3.5 text-left font-mono font-bold text-[#E6C587]">
                        {res.amount.toLocaleString('ar-SA')} ريال
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guest Requests Ticker */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#E6C587] flex items-center gap-2">
                <ConciergeBell size={18} />
                <span>طلبات النزلاء النشطة والجديدة</span>
              </h2>
              <button 
                onClick={() => onNavigate('طلبات النزلاء')}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>إدارة الطلبات</span>
                <ChevronLeft size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentRequests.map((req) => (
                <div key={req.id} className="p-4 bg-[#121212] border border-gray-800 rounded-xl hover:border-[#D4AF37]/20 transition duration-200 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-amber-950/20 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                        {req.type === 'room_service' ? <Coffee size={14} /> :
                         req.type === 'laundry' ? <Shirt size={14} /> :
                         <ConciergeBell size={14} />}
                      </span>
                      <div>
                        <span className="text-xs text-gray-400 font-bold">غرفة {req.roomNumber}</span>
                        <div className="text-[10px] text-gray-500 font-mono">سجل في: {req.timestamp}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      req.priority === 'high' ? 'bg-red-950/40 text-red-400 border border-red-500/20' :
                      req.priority === 'medium' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/20' :
                      'bg-gray-900 text-gray-400 border border-gray-800'
                    }`}>
                      {req.priority === 'high' ? 'عاجل جداً' :
                       req.priority === 'medium' ? 'متوسط الأهمية' :
                       'عادي'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium line-clamp-2">
                    {req.details}
                  </p>
                  <div className="border-t border-gray-800/60 pt-2 flex justify-between items-center text-[11px]">
                    <span className="text-gray-500">المسؤول: <strong className="text-gray-300">{req.assignee || 'غير معين'}</strong></span>
                    <span className="px-2 py-0.5 bg-blue-950/20 text-blue-400 rounded-md font-bold">
                      {req.status === 'pending' ? 'قيد الانتظار' : 'جاري التنفيذ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Live Activities */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-md font-bold text-[#E6C587] flex items-center gap-2 border-b border-gray-800 pb-3">
              <Sparkles size={16} className="text-[#D4AF37]" />
              <span>إجراءات التشغيل السريعة</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onOpenQuickBook}
                className="p-4 bg-gradient-to-br from-[#121212] to-[#181818] border border-gray-800 hover:border-[#D4AF37]/30 hover:to-[#222] text-right rounded-xl transition duration-200 space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-950/30 text-[#D4AF37] border border-[#D4AF37]/10 flex items-center justify-center group-hover:scale-105 transition-all">
                  <Calendar size={16} />
                </div>
                <h4 className="text-xs font-bold text-white">تسجيل حجز جديد</h4>
                <p className="text-[10px] text-gray-500">إدخال نزيل جديد للجناح</p>
              </button>

              <button 
                onClick={onOpenQuickRequest}
                className="p-4 bg-gradient-to-br from-[#121212] to-[#181818] border border-gray-800 hover:border-[#D4AF37]/30 hover:to-[#222] text-right rounded-xl transition duration-200 space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-950/30 text-blue-400 border border-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-all">
                  <ConciergeBell size={16} />
                </div>
                <h4 className="text-xs font-bold text-white">تسجيل طلب خدمة</h4>
                <p className="text-[10px] text-gray-500">خدمة غرف ومغسلة ونقل</p>
              </button>

              <button 
                onClick={() => onNavigate('الغرف')}
                className="p-4 bg-gradient-to-br from-[#121212] to-[#181818] border border-gray-800 hover:border-[#D4AF37]/30 hover:to-[#222] text-right rounded-xl transition duration-200 space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-950/30 text-purple-400 border border-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-all">
                  <BedDouble size={16} />
                </div>
                <h4 className="text-xs font-bold text-white">حالة الغرف</h4>
                <p className="text-[10px] text-gray-500">تعديل حالة تنظيف وصيانة</p>
              </button>

              <button 
                onClick={() => onNavigate('المدفوعات')}
                className="p-4 bg-gradient-to-br from-[#121212] to-[#181818] border border-gray-800 hover:border-[#D4AF37]/30 hover:to-[#222] text-right rounded-xl transition duration-200 space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 flex items-center justify-center group-hover:scale-105 transition-all">
                  <CreditCard size={16} />
                </div>
                <h4 className="text-xs font-bold text-white">الفواتير والمالية</h4>
                <p className="text-[10px] text-gray-500">عرض العمليات والمستحقات</p>
              </button>
            </div>
          </div>

          {/* Live System Activities Feed */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-md font-bold text-[#E6C587] flex items-center gap-2 border-b border-gray-800 pb-3">
              <Activity size={16} className="text-blue-400" />
              <span>آخر النشاطات والعمليات التشغيلية</span>
            </h2>
            <div className="relative border-r-2 border-gray-800 pr-4 space-y-6 text-xs">
              {/* Event 1 */}
              <div className="relative">
                <span className="absolute top-1.5 -right-[21px] w-2 h-2 rounded-full bg-amber-500 border border-black ring-4 ring-[#0b0b0b]" />
                <div className="font-bold text-gray-300">تسجيل وصول: الشيخ سلمان آل سعود</div>
                <div className="text-gray-500 mt-0.5">غرفة 501 • بواسطة موظف الاستقبال خالد</div>
                <div className="text-[10px] font-mono text-gray-600 mt-1">منذ 15 دقيقة</div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <span className="absolute top-1.5 -right-[21px] w-2 h-2 rounded-full bg-emerald-500 border border-black ring-4 ring-[#0b0b0b]" />
                <div className="font-bold text-gray-300">إنهاء تنظيف الجناح 301 بالكامل</div>
                <div className="text-gray-500 mt-0.5">تم نقله للحالة "متاح" لضيوف الغد</div>
                <div className="text-[10px] font-mono text-gray-600 mt-1">منذ 34 دقيقة</div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <span className="absolute top-1.5 -right-[21px] w-2 h-2 rounded-full bg-blue-500 border border-black ring-4 ring-[#0b0b0b]" />
                <div className="font-bold text-gray-300">فاتورة إلكترونية مسددة</div>
                <div className="text-gray-500 mt-0.5">قيمة الإقامة للمهندس يوسف • بقيمة 12,000 ريال</div>
                <div className="text-[10px] font-mono text-gray-600 mt-1">منذ ساعة واحدة</div>
              </div>

              {/* Event 4 */}
              <div className="relative">
                <span className="absolute top-1.5 -right-[21px] w-2 h-2 rounded-full bg-red-500 border border-black ring-4 ring-[#0b0b0b]" />
                <div className="font-bold text-gray-300">بلاغ صيانة عاجل: لوحة إضاءة جناح 202</div>
                <div className="text-gray-500 mt-0.5">تم توجيه البلاغ تلقائياً للفني أحمد الحربي</div>
                <div className="text-[10px] font-mono text-gray-600 mt-1">منذ ساعتين</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
