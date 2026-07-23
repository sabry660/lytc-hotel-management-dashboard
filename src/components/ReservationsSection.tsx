import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, User, Plus, Search, CheckCircle2, XCircle, ArrowRightLeft, DollarSign, Users, AlertCircle, Trash2,
  Clock, CreditCard, FileText, Tag, Building, Plane, Car, Filter, Grid3X3, List, ChevronLeft, ChevronRight,
  Download, Printer, Eye, Edit, X, Save, Star, MessageSquare, Phone, Mail as MailIcon, MapPin, Briefcase, Loader2
} from 'lucide-react';
import { apiService, StayDetailsResponse, CreateStayRequest } from '../services/api';
import { useThemeColors } from '../hooks/useThemeColors';

export default function ReservationsSection() {
  const { colors, isDark } = useThemeColors();
  const [stays, setStays] = useState<StayDetailsResponse[]>([]);
  const [todayArrivals, setTodayArrivals] = useState<StayDetailsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'closed' | 'booked'>('all');
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
      if (error.message && error.message.includes('Authentication')) {
        setError('فشل المصادقة. يرجى تسجيل الدخول مرة أخرى.');
      } else if (error.message && error.message.includes('NetworkError')) {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else {
        setError('فشل تحميل البيانات. الرجاء المحاولة مرة أخرى.');
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
      if (error.message && error.message.includes('NetworkError')) {
        // Silently handle network error for arrivals
        setTodayArrivals([]);
      } else {
        setTodayArrivals([]);
      }
    }
  };

  // New Reservation Form States
  const [guestName, setGuestName] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [checkIn, setCheckIn] = useState('2026-07-19');
  const [checkOut, setCheckOut] = useState('2026-07-26');
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
    if (activeTab === 'active') return stay.status === 'CHECKED_IN';
    if (activeTab === 'closed') return stay.status === 'CHECKED_OUT';
    if (activeTab === 'booked') return stay.status === 'RESERVED';
    return true;
  });

  const loadAvailableRooms = async () => {
    try {
      const response = await apiService.getRooms();
      const available = response.content.filter((room: any) => 
        room.status === 'available' || room.status === 'AVAILABLE'
      );
      setAvailableRooms(available);
    } catch (error) {
      console.error('Failed to load available rooms:', error);
      setAvailableRooms([]);
    }
  };

  const handleOpenModal = () => {
    loadAvailableRooms();
    setIsModalOpen(true);
  };

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
        phone: '0500000000',
        roomNumber: selectedRoomNumber,
        numAdults: adults,
        numKids: children,
        expectedCheckInDate: checkIn,
        expectedCheckOutDate: checkOut,
      };

      console.log('Creating stay with data:', newStay);
      await apiService.createStay(newStay);

      // Reset form
      setGuestName('');
      setSelectedRoomNumber('');
      setCheckIn('2026-07-19');
      setCheckOut('2026-07-26');
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
      // First check if the room is available
      const stay = stays.find(s => s.stayId === stayId);
      if (!stay) {
        alert('لم يتم العثور على الحجز');
        return;
      }

      // Get rooms to check availability
      const roomsResponse = await apiService.getRooms(undefined, undefined, 0, 100);
      console.log('Available rooms:', roomsResponse.content);
      console.log('Looking for room number:', stay.roomNumber);
      
      const room = roomsResponse.content?.find(r => {
        console.log('Comparing:', r.roomNumber, 'with', stay.roomNumber, 'Match:', r.roomNumber === stay.roomNumber);
        return r.roomNumber === stay.roomNumber;
      });

      if (!room) {
        console.error('Room not found. Available room numbers:', roomsResponse.content?.map(r => r.roomNumber));
        alert(`لم يتم العثور على الغرفة رقم ${stay.roomNumber}`);
        return;
      }

      if (room.status !== 'AVAILABLE') {
        alert(`الغرفة غير متاحة حالياً. حالتها: ${room.status}`);
        return;
      }

      await apiService.checkInStay(stayId);
      loadStays();
    } catch (error) {
      console.error('Failed to check-in:', error);
      alert('فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleCheckOut = async (stayId: number) => {
    try {
      await apiService.checkOutStay(stayId);
      loadStays();
    } catch (error) {
      console.error('Failed to check-out:', error);
      alert('فشل تسجيل المغادرة. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5 ${isDark ? 'border-gray-900' : 'border-gray-200'}`}>
        <div>
          <h1 className="text-2xl font-black" style={{ color: colors.primary.goldLight }}>جدول وإدارة الحجوزات</h1>
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>عرض وتنسيق ملفات الحجوزات، والتحكم في إجراءات الدخول والمغادرة والفوترة.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
          style={{ background: colors.primary.goldGradient }}
        >
          <Plus size={15} />
          <span>حجز جناح جديد</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border p-4 rounded-xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'all' ? 'bg-[#D4AF37] text-black' : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800' : 'bg-gray-100 text-gray-600 border border-gray-300')
            }`}
          >
            كافة الحجوزات ({stays.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'active' ? 'bg-[#D4AF37] text-black' : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800' : 'bg-gray-100 text-gray-600 border border-gray-300')
            }`}
          >
            نشط
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'closed' ? 'bg-[#D4AF37] text-black' : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800' : 'bg-gray-100 text-gray-600 border border-gray-300')
            }`}
          >
            مغلق
          </button>
          <button
            onClick={() => setActiveTab('booked')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'booked' ? 'bg-[#D4AF37] text-black' : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800' : 'bg-gray-100 text-gray-600 border border-gray-300')
            }`}
          >
            محجوز
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: colors.text.muted }} />
            <input
              type="text"
              placeholder="بحث بالاسم أو الغرفة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`rounded-lg px-4 py-2 pr-10 text-xs focus:outline-none w-48 ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
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
        <div className={`text-center py-16 border rounded-2xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>فشل تحميل الحجوزات</h3>
          <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>{error}</p>
          <button
            onClick={loadStays}
            className="px-4 py-2 text-black font-extrabold text-xs rounded-xl"
            style={{ background: colors.primary.gold }}
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredStays.length === 0 ? (
        <div className={`text-center py-16 border rounded-2xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: colors.text.muted }} />
          <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>لا توجد حجوزات</h3>
          <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>ابدأ بإضافة حجز جديد</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الضيف</th>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الغرفة</th>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>تسجيل الدخول</th>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>تسجيل المغادرة</th>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الحالة</th>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>المبلغ</th>
                <th className={`text-xs font-bold text-right pb-3 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStays.map((stay) => (
                <tr key={stay.stayId} className={`border-b transition-colors ${isDark ? 'border-gray-800/50 hover:bg-[#121212]/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${colors.primary.gold}20`, borderColor: `${colors.primary.gold}30`, border: '1px solid' }}>
                        <User size={14} style={{ color: colors.primary.goldLight }} />
                      </div>
                      <span className="text-sm font-bold" style={{ color: colors.text.primary }}>{stay.guestName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm" style={{ color: colors.text.primary }}>{stay.roomNumber}</td>
                  <td className="py-3 text-sm" style={{ color: colors.text.muted }}>{stay.checkInTime ? new Date(stay.checkInTime).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-'}</td>
                  <td className="py-3 text-sm" style={{ color: colors.text.muted }}>{stay.expectedCheckOutDate ? new Date(stay.expectedCheckOutDate).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                      stay.status === 'CHECKED_IN' ? (isDark ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200') :
                      stay.status === 'CHECKED_OUT' ? (isDark ? 'bg-red-950/40 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200') :
                      stay.status === 'RESERVED' ? (isDark ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200') :
                      (isDark ? 'bg-gray-950/40 text-gray-400 border-gray-800' : 'bg-gray-50 text-gray-600 border-gray-300')
                    }`}>
                      {stay.status === 'CHECKED_IN' ? 'نشط' : 
                       stay.status === 'CHECKED_OUT' ? 'مغلق' : 
                       stay.status === 'RESERVED' ? 'محجوز' : 
                       stay.status === 'AVAILABLE' ? 'متاح' :
                       stay.status === 'OCCUPIED' ? 'مشغول' :
                       stay.status || '-'}
                    </span>
                  </td>
                  <td className="py-3 text-sm font-bold" style={{ color: colors.primary.goldLight }}>{stay.totalCharge ? stay.totalCharge.toLocaleString('ar-SA', { maximumFractionDigits: 0 }) : '0'} ريال</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCheckIn(stay.stayId)}
                        disabled={stay.status === 'CHECKED_IN'}
                        className={`px-3 py-1.5 border rounded-lg hover:border-[#D4AF37]/30 transition disabled:opacity-50 text-xs font-bold ${isDark ? 'bg-[#121212] border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-900'}`}
                      >
                        تسجيل دخول
                      </button>
                      <button
                        onClick={() => handleCheckOut(stay.stayId)}
                        disabled={stay.status !== 'CHECKED_IN'}
                        className={`px-3 py-1.5 border rounded-lg hover:border-[#D4AF37]/30 transition disabled:opacity-50 text-xs font-bold ${isDark ? 'bg-[#121212] border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-900'}`}
                      >
                        تسجيل مغادرة
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
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }}>
          <div className={`border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0b0b0b] border-[#D4AF37]/30' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold" style={{ color: colors.primary.goldLight }}>حجز جناح جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className={`p-2 border rounded-lg ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'}`}>
                <X size={18} />
              </button>
            </div>

            {createStayError && (
              <div className={`border text-sm p-3 rounded-lg mb-4 ${isDark ? 'bg-red-950/40 border-red-500/30 text-red-200' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {createStayError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>اسم الضيف</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                />
              </div>

              <div>
                <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>رقم الغرفة</label>
                <select
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                >
                  <option value="">اختر غرفة متاحة</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.number}>
                      {room.number} - {room.type} ({room.pricePerNight} ريال/ليلة)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>تسجيل الدخول</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>تسجيل المغادرة</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>عدد البالغين</label>
                  <input
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    min="1"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>عدد الأطفال</label>
                  <input
                    type="number"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    min="0"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  />
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold transition ${isDark ? 'bg-[#121212] border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-900'}`}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleCreateReservation}
                  disabled={isCreatingStay}
                  className="px-6 py-2 text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                  style={{ background: colors.primary.goldGradient }}
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
