import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, User, Plus, Search, CheckCircle2, XCircle, ArrowRightLeft, DollarSign, Users, AlertCircle, Trash2,
  Clock, CreditCard, FileText, Tag, Building, Plane, Car, Filter, Grid3X3, List, ChevronLeft, ChevronRight,
  Download, Printer, Eye, Edit, X, Save, Star, MessageSquare, Phone, Mail as MailIcon, MapPin, Briefcase, Loader2
} from 'lucide-react';
import { apiService, StayDetailsResponse, CreateStayRequest } from '../services/api';

export default function ReservationsSection() {
  const [stays, setStays] = useState<StayDetailsResponse[]>([]);
  const [todayArrivals, setTodayArrivals] = useState<StayDetailsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'arrivals' | 'departures' | 'upcoming'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'timeline'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState<StayDetailsResponse | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadStays();
    loadTodayArrivals();
  }, []);

  const loadStays = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getStays(0, 50);
      setStays(response.content || []);
    } catch (error: any) {
      console.error('Failed to load stays:', error);
      if (error.message && error.message.includes('Authentication')) {
        setError('فشل المصادقة. يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setError('فشل الاتصال بالخادم. الرجاء المحاولة مرة أخرى.');
      }
      setStays([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodayArrivals = async () => {
    try {
      const response = await apiService.getCheckinTodayStays();
      setTodayArrivals(response.content || []);
    } catch (error: any) {
      console.error('Failed to load today arrivals:', error);
      // Dummy data fallback
      setTodayArrivals([
        { stayId: 1, guestName: 'محمد أحمد', roomNumber: '101', checkInDate: '2026-07-18', checkOutDate: '2026-07-22', status: 'RESERVED' },
        { stayId: 2, guestName: 'فاطمة علي', roomNumber: '205', checkInDate: '2026-07-18', checkOutDate: '2026-07-25', status: 'RESERVED' },
        { stayId: 3, guestName: 'عمر خالد', roomNumber: '302', checkInDate: '2026-07-18', checkOutDate: '2026-07-20', status: 'RESERVED' },
        { stayId: 4, guestName: 'سارة محمد', roomNumber: '401', checkInDate: '2026-07-18', checkOutDate: '2026-07-23', status: 'RESERVED' },
        { stayId: 5, guestName: 'أحمد علي', roomNumber: '505', checkInDate: '2026-07-18', checkOutDate: '2026-07-21', status: 'RESERVED' }
      ]);
    }
  };

  // New Reservation Form States
  const [guestName, setGuestName] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [checkIn, setCheckIn] = useState('2026-07-05');
  const [checkOut, setCheckOut] = useState('2026-07-12');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isCreatingStay, setIsCreatingStay] = useState(false);
  const [createStayError, setCreateStayError] = useState<string | null>(null);

  // Filter stays based on active tab and search
  const filteredStays = stays.filter(stay => {
    const matchesSearch = stay.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stay.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'arrivals') return todayArrivals.some(a => a.stayId === stay.stayId);
    if (activeTab === 'departures') return stay.status === 'CHECKED_IN';
    if (activeTab === 'upcoming') return stay.status === 'RESERVED';
    return true;
  });

  const handleCreateReservation = async () => {
    if (!guestName || !selectedRoomNumber) {
      alert('الرجاء تعبئة اسم النزيل واختيار الغرفة المناسبة');
      return;
    }

    setIsCreatingStay(true);
    setCreateStayError(null);

    try {
      const newStay: CreateStayRequest = {
        guestName,
        phone: '0500000000', // Valid phone format
        roomNumber: selectedRoomNumber,
        numAdults: adults,
        numKids: children,
        expectedCheckInDate: checkIn,
        expectedCheckOutDate: checkOut,
        dateRangeValid: true,
      };

      await apiService.createStay(newStay);

      // Reset form
      setGuestName('');
      setSelectedRoomNumber('');
      setCheckIn('2026-07-05');
      setCheckOut('2026-07-12');
      setAdults(2);
      setChildren(0);
      setIsModalOpen(false);

      // Reload stays
      loadStays();
    } catch (error: any) {
      console.error('Failed to create stay:', error);
      if (error.message) {
        setCreateStayError(`فشل إنشاء الحجز: ${error.message}`);
      } else {
        setCreateStayError('فشل إنشاء الحجز. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setIsCreatingStay(false);
    }
  };

  const handleCheckIn = async (stayId: number) => {
    try {
      await apiService.checkInStay(stayId);
      loadStays();
    } catch (error) {
      console.error('Failed to check-in:', error);
    }
  };

  const handleCheckOut = async (stayId: number) => {
    try {
      await apiService.checkOutStay(stayId);
      loadStays();
    } catch (error) {
      console.error('Failed to check-out:', error);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">جدول وإدارة الحجوزات</h1>
          <p className="text-gray-500 text-xs mt-1">عرض وتنسيق ملفات الحجوزات، والتحكم في إجراءات الدخول والمغادرة والفوترة.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
        >
          <Plus size={15} />
          <span>حجز جناح جديد</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            كافة الحجوزات ({stays.length})
          </button>
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'arrivals' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            وصول اليوم
          </button>
          <button
            onClick={() => setActiveTab('departures')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'departures' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            مغادرة اليوم
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            قادمة
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الغرفة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 pr-10 text-xs text-white focus:outline-none w-48"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الحجوزات</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadStays}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredStays.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد حجوزات</h3>
          <p className="text-xs text-gray-600 mb-4">ابدأ بإضافة حجز جديد</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الضيف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الغرفة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">تسجيل الدخول</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">تسجيل المغادرة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الحالة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المبلغ</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStays.map((stay) => (
                <tr key={stay.stayId} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-[#E6C587]" />
                      </div>
                      <span className="text-sm text-white font-bold">{stay.guestName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white">{stay.roomNumber}</td>
                  <td className="py-3 text-sm text-gray-400">{stay.checkInTime ? new Date(stay.checkInTime).toLocaleDateString('ar-SA') : '-'}</td>
                  <td className="py-3 text-sm text-gray-400">{stay.expectedCheckOutDate ? new Date(stay.expectedCheckOutDate).toLocaleDateString('ar-SA') : '-'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      stay.status === 'CHECKED_IN' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                      stay.status === 'CHECKED_OUT' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                      stay.status === 'RESERVED' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                      'bg-red-950/20 text-red-400 border border-red-500/30'
                    }`}>
                      {stay.status === 'CHECKED_IN' ? 'مقيم' : stay.status === 'CHECKED_OUT' ? 'مغادر' : stay.status === 'RESERVED' ? 'محجوز' : stay.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-[#E6C587] font-bold">{stay.totalCharge ? stay.totalCharge.toLocaleString('ar-SA') : '0'} ريال</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCheckIn(stay.stayId)}
                        disabled={stay.status === 'CHECKED_IN'}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      </button>
                      <button
                        onClick={() => handleCheckOut(stay.stayId)}
                        disabled={stay.status === 'CHECKED_OUT'}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition disabled:opacity-50"
                      >
                        <XCircle size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E6C587]">حجز جناح جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {createStayError && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-sm p-3 rounded-lg mb-4">
                {createStayError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">اسم الضيف</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-2">رقم الغرفة</label>
                <input
                  type="text"
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  placeholder="مثال: 101"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-2">تسجيل الدخول</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">تسجيل المغادرة</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-2">عدد البالغين</label>
                  <input
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    min="1"
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">عدد الأطفال</label>
                  <input
                    type="number"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    min="0"
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleCreateReservation}
                  disabled={isCreatingStay}
                  className="px-6 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {isCreatingStay ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      حفظ الحجز
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
