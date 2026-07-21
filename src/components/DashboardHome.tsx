import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Calendar, BedDouble, Users, MessageSquare, Wrench, ShieldAlert, Sparkles, 
  Clock, CloudSun, Compass, UserCheck, CreditCard, ChevronLeft, Star, Heart,
  Activity, ArrowUpRight, ArrowDownRight, Coffee, Shirt, ConciergeBell, Loader2
} from 'lucide-react';
import { Room, Reservation, Guest, ServiceRequest, HousekeepingTask, MaintenanceTicket, Invoice } from '../types';
import { apiService } from '../services/api';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
  onOpenQuickBook: () => void;
  onOpenQuickRequest: () => void;
}

export default function DashboardHome({
  onNavigate,
  onOpenQuickBook,
  onOpenQuickRequest
}: DashboardHomeProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [userRole, setUserRole] = useState<string>('المدير');
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stays, setStays] = useState<any[]>([]);
  const [vips, setVips] = useState<any[]>([]);
  const [specialOrders, setSpecialOrders] = useState<any[]>([]);
  const [restaurantStats, setRestaurantStats] = useState<any>(null);
  const [cafeStats, setCafeStats] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user role from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('lytc_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const roleMap: { [key: string]: string } = {
          'MANAGER': 'المدير',
          'ADMIN': 'المسؤول',
          'STAFF': 'الموظف',
          'GUEST': 'الضيف'
        };
        setUserRole(roleMap[user.role] || 'المدير');
      } catch (e) {
        setUserRole('المدير');
      }
    }
  }, []);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [roomsData, staysData, vipsData, specialOrdersData, restaurantStatsData, cafeStatsData] = await Promise.all([
          apiService.getRooms(undefined, undefined, 0, 100),
          apiService.getStays(0, 50),
          apiService.getVips(0, 20),
          apiService.getManagerSpecialOrders(),
          apiService.getRestaurantStats(),
          apiService.getCafeStats()
        ]);

        console.log('API Responses:', {
          roomsData,
          staysData,
          vipsData,
          specialOrdersData,
          restaurantStatsData,
          cafeStatsData
        });

        // Transform rooms data
        const transformedRooms = (roomsData.content || []).map((room: any) => ({
          id: room.id.toString(),
          number: room.roomNumber,
          status: room.status.toLowerCase() as Room['status'],
          floor: room.floor,
          type: room.type || 'جناح',
          capacity: room.maxAdults + (room.maxKids || 0),
          pricePerNight: room.price || 0,
          images: room.images || [],
          name: `جناح ${room.roomNumber}`,
          lastUpdated: new Date().toLocaleDateString('ar-SA'),
          occupancyRate: room.status === 'OCCUPIED' ? 100 : 0
        }));
        setRooms(transformedRooms);

        // Transform stays data - ensure it's an array
        const staysArray = Array.isArray(staysData) ? staysData : (staysData.content || []);
        setStays(staysArray);

        // Transform vips data - ensure it's an array
        const vipsArray = Array.isArray(vipsData) ? vipsData : (vipsData.content || []);
        setVips(vipsArray);

        // Transform special orders - ensure it's an array
        const specialOrdersArray = Array.isArray(specialOrdersData) ? specialOrdersData : [];
        setSpecialOrders(specialOrdersArray);

        setRestaurantStats(restaurantStatsData);
        setCafeStats(cafeStatsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set empty arrays on error to prevent filter errors
        setRooms([]);
        setStays([]);
        setVips([]);
        setSpecialOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Compute live real metrics from API data
  const totalBookings = (stays || []).length;
  const occupiedRoomsCount = (rooms || []).filter(r => r.status === 'occupied').length;
  const availableRoomsCount = (rooms || []).filter(r => r.status === 'available').length;
  const totalRevenue = 0; // No invoice API available yet

  const activeGuestsCount = (stays || []).filter(s => s.status === 'CHECKED_IN').length;

  const pendingRequestsCount = (specialOrders || []).filter(s => s.status === 'PENDING').length;
  const openMaintenanceCount = 0; // No maintenance API available yet

  // New Executive Dashboard KPIs
  const averageRoomRate = (rooms || []).length > 0 
    ? (rooms || []).reduce((sum, r) => sum + r.pricePerNight, 0) / (rooms || []).length 
    : 0;
  
  const revPAR = availableRoomsCount > 0 
    ? totalRevenue / ((rooms || []).length - occupiedRoomsCount) 
    : 0;

  const directBookings = (stays || []).filter(s => s.bookingSource === 'DIRECT' || !s.bookingSource).length;

  const platformBookings = (stays || []).filter(s => s.bookingSource && s.bookingSource !== 'DIRECT').length;

  const cancellationRate = (stays || []).length > 0 
    ? ((stays || []).filter(s => s.status === 'CANCELLED').length / (stays || []).length) * 100 
    : 0;

  const pendingPayments = 0; // No invoice API available yet

  const pendingHousekeeping = (rooms || []).filter(r => r.status === 'cleaning').length;

  const vipGuestsArriving = (vips || []).length;

  const latestReservations = [...(stays || [])]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  const recentRequests = [...(specialOrders || [])]
    .filter(s => s.status !== 'COMPLETED')
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : (
        <>
      {/* Upper Welcoming Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#0c0c0c] via-[#121212] to-[#0a0a0a] border border-[#D4AF37]/15 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
        {/* Abstract Golden Circles Backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-48 h-48 bg-radial-gradient from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-gray-500">النظام الفني متصل ومستقر</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#E6C587] tracking-tight">
            مرحباً {userRole}
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
            <div className="text-[10px] text-gray-500 mt-0.5">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="h-10 w-[1px] bg-gray-800" />
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-400 text-xs justify-end">
              <CloudSun size={15} className="text-[#D4AF37]" />
              <span>الطقس اليوم</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              --° م
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">--</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Reservations */}
        <div className="p-4 sm:p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-[#D4AF37]/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold">إجمالي الحجوزات النشطة</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2 font-mono">{totalBookings}</h3>
            </div>
            <div className="p-3 bg-amber-950/20 text-[#D4AF37] rounded-xl border border-[#D4AF37]/10">
              <Calendar size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <span className="text-gray-600">مقارنة بالأسبوع الماضي</span>
          </div>
        </div>

        {/* KPI 2: Occupied Rooms */}
        <div className="p-4 sm:p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-blue-500/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold">الغرف المشغولة الآن</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2 font-mono">
                {occupiedRoomsCount} <span className="text-[10px] sm:text-xs text-gray-500 font-sans">/ {rooms.length}</span>
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-blue-950/20 text-blue-400 rounded-xl border border-blue-500/10">
              <BedDouble size={18} sm:size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">
            <span className="font-bold text-[#D4AF37]">
              {Math.round((occupiedRoomsCount / rooms.length) * 100)}%
            </span>
            <span className="text-gray-600">معدل الإشغال الإجمالي</span>
          </div>
        </div>

        {/* KPI 3: Occupied Rooms */}
        <div className="p-4 sm:p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold">الغرف المتاحة للحجز</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 sm:mt-2 font-mono">
                {availableRoomsCount}
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-emerald-950/20 text-emerald-400 rounded-xl border border-emerald-500/10">
              <UserCheck size={18} sm:size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">
            <span className="font-bold text-emerald-400">
              {(rooms || []).filter(r => r.status === 'cleaning').length} غرف
            </span>
            <span className="text-gray-600">تحت التنظيف حالياً</span>
          </div>
        </div>

        {/* KPI 4: Financial Revenues */}
        <div className="p-4 sm:p-6 bg-[#0c0c0c] border border-gray-900 rounded-xl hover:border-[#D4AF37]/35 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#D4AF37] to-[#AA7B30]" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold">إجمالي الإيرادات المباشرة</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2 font-mono">
                {totalRevenue.toLocaleString('ar-SA')} <span className="text-[10px] sm:text-xs text-[#D4AF37] font-sans">ريال</span>
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-amber-950/20 text-[#D4AF37] rounded-xl border border-[#D4AF37]/10">
              <CreditCard size={18} sm:size={22} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">
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
          onClick={() => onNavigate('الغرف')}
          className="p-4 bg-[#090909] border border-gray-900 rounded-xl flex items-center justify-between hover:border-teal-500/35 transition duration-200 w-full"
        >
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-gray-500">غرف تحت التنظيف</span>
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
            <div className="text-lg font-bold text-white font-mono">-- ريال</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg">
            <Coffee size={16} />
          </div>
        </button>

        {/* Spa Revenue - Removed as no page exists */}

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
            <div className="text-lg font-bold text-white font-mono">--° م</div>
          </div>
          <div className="p-2 bg-sky-950/20 text-sky-400 rounded-lg">
            <CloudSun size={16} />
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
            <div className="text-xl font-bold text-[#E6C587] font-mono">--%</div>
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
                        {res.amount ? res.amount.toLocaleString('ar-SA') : '0'} ريال
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
                <span>الطلبات الخاصة النشطة</span>
              </h2>
              <button 
                onClick={() => onNavigate('الطلبات الخاصة')}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>إدارة الطلبات</span>
                <ChevronLeft size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentRequests.length > 0 ? recentRequests.map((req) => (
                <div key={req.id} className="p-4 bg-[#121212] border border-gray-800 rounded-xl hover:border-[#D4AF37]/20 transition duration-200 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-amber-950/20 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                        <ConciergeBell size={14} />
                      </span>
                      <div>
                        <span className="text-xs text-gray-400 font-bold">طلب #{req.id}</span>
                        <div className="text-[10px] text-gray-500 font-mono">{new Date(req.createdAt).toLocaleDateString('ar-SA')}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      req.status === 'PENDING' ? 'bg-amber-950/40 text-amber-500 border border-amber-500/20' :
                      req.status === 'IN_PROGRESS' ? 'bg-blue-950/40 text-blue-400 border border-blue-500/20' :
                      'bg-gray-900 text-gray-400 border border-gray-800'
                    }`}>
                      {req.status === 'PENDING' ? 'قيد الانتظار' : 
                       req.status === 'IN_PROGRESS' ? 'جاري التنفيذ' :
                       'مكتمل'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium line-clamp-2">
                    {req.description || 'طلب خاص'}
                  </p>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8 text-gray-500 text-xs">
                  لا توجد طلبات خاصة نشطة
                </div>
              )}
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

          {/* Live System Activities Feed - Removed dummy data */}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
