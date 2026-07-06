import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, User, Plus, Search, CheckCircle2, XCircle, ArrowRightLeft, DollarSign, Users, AlertCircle, Trash2,
  Clock, CreditCard, FileText, Tag, Building, Plane, Car, Filter, Grid3X3, List, ChevronLeft, ChevronRight,
  Download, Printer, Eye, Edit, X, Save, Star, MessageSquare, Phone, Mail as MailIcon, MapPin, Briefcase
} from 'lucide-react';
import { Reservation, Room, Guest } from '../types';

interface ReservationsSectionProps {
  reservations: Reservation[];
  rooms: Room[];
  guests: Guest[];
  onAddReservation: (res: Reservation) => void;
  onUpdateReservationStatus: (resId: string, status: Reservation['status']) => void;
}

export default function ReservationsSection({
  reservations,
  rooms,
  guests,
  onAddReservation,
  onUpdateReservationStatus
}: ReservationsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'arrivals' | 'departures' | 'upcoming'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'timeline'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // New Reservation Form States
  const [guestName, setGuestName] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [checkIn, setCheckIn] = useState('2026-07-05');
  const [checkOut, setCheckOut] = useState('2026-07-12');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'pending'>('pending');
  const [depositAmount, setDepositAmount] = useState(0);
  const [guestNotes, setGuestNotes] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingSource, setBookingSource] = useState<'direct' | 'website' | 'booking.com' | 'agency'>('direct');
  const [discountCode, setDiscountCode] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [isGroupBooking, setIsGroupBooking] = useState(false);
  const [isCorporateBooking, setIsCorporateBooking] = useState(false);

  // Dynamic calculations inside form
  const selectedRoomObj = rooms.find(r => r.number === selectedRoomNumber);
  const pricePerNight = selectedRoomObj ? selectedRoomObj.pricePerNight : 0;
  
  const getDaysCount = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  const daysCount = getDaysCount();
  const calculatedTotal = pricePerNight * daysCount;

  // Filter reservations based on active tab and search
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.roomNumber.includes(searchQuery);
    
    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'arrivals') return res.status === 'upcoming' && res.checkIn === '2026-07-05';
    if (activeTab === 'departures') return res.status === 'checked_in' && res.checkOut === '2026-07-05';
    if (activeTab === 'upcoming') return res.status === 'upcoming';
    return true;
  });

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedRoomNumber) {
      alert('الرجاء تعبئة اسم النزيل واختيار الغرفة المناسبة');
      return;
    }

    const newRes: Reservation = {
      id: `res-${Date.now().toString().slice(-4)}`,
      guestName,
      roomNumber: selectedRoomNumber,
      checkIn,
      checkOut,
      status: 'upcoming',
      amount: calculatedTotal,
      guestId: `g-${Date.now().toString().slice(-4)}`,
      adultCount: adults,
      childrenCount: children
    };

    onAddReservation(newRes);
    setIsModalOpen(false);
    
    // Clear form
    setGuestName('');
    setSelectedRoomNumber('');
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
            كافة الحجوزات ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'arrivals' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            وصول اليوم (0)
          </button>
          <button
            onClick={() => setActiveTab('departures')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'departures' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            مغادرة اليوم (1)
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            قادمة (2)
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
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded transition ${viewMode === 'calendar' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded transition ${viewMode === 'timeline' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="p-2 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
            >
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <h3 className="text-lg font-bold text-white">
              {currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              className="p-2 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
            >
              <ChevronLeft size={18} className="text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
              <div key={day} className="text-xs text-gray-500 font-bold py-2">{day}</div>
            ))}
            {/* Calendar days would be rendered here */}
            {Array.from({ length: 35 }).map((_, idx) => (
              <div key={idx} className="p-2 bg-[#121212] border border-gray-800 rounded-lg min-h-[80px] hover:border-[#D4AF37]/30 transition cursor-pointer">
                <span className="text-xs text-gray-400">{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-4">الجدول الزمني للحجوزات</h3>
          <div className="space-y-3">
            {filteredReservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-[#121212] border border-gray-800 rounded-xl hover:border-[#D4AF37]/30 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                      <User size={18} className="text-[#E6C587]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{reservation.guestName}</h4>
                      <p className="text-xs text-gray-500">غرفة {reservation.roomNumber}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">{reservation.checkIn}</p>
                    <p className="text-xs text-gray-400">{reservation.checkOut}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    reservation.status === 'checked_in' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                    reservation.status === 'checked_out' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                    reservation.status === 'upcoming' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                    'bg-red-950/20 text-red-400 border border-red-500/30'
                  }`}>
                    {reservation.status === 'checked_in' ? 'مقيم' : reservation.status === 'checked_out' ? 'مغادر' : reservation.status === 'upcoming' ? 'قادم' : 'ملغي'}
                  </span>
                  <span className="text-sm text-[#E6C587] font-bold">{reservation.amount.toLocaleString('ar-SA')} ريال</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
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
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-[#E6C587]" />
                      </div>
                      <span className="text-sm text-white font-bold">{reservation.guestName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white">{reservation.roomNumber}</td>
                  <td className="py-3 text-sm text-gray-400">{reservation.checkIn}</td>
                  <td className="py-3 text-sm text-gray-400">{reservation.checkOut}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      reservation.status === 'checked_in' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                      reservation.status === 'checked_out' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                      reservation.status === 'upcoming' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                      'bg-red-950/20 text-red-400 border border-red-500/30'
                    }`}>
                      {reservation.status === 'checked_in' ? 'مقيم' : reservation.status === 'checked_out' ? 'مغادر' : reservation.status === 'upcoming' ? 'قادم' : 'ملغي'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-[#E6C587] font-bold">{reservation.amount.toLocaleString('ar-SA')} ريال</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                      >
                        <Eye size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => onUpdateReservationStatus(reservation.id, reservation.status === 'checked_in' ? 'checked_out' : 'checked_in')}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400" />
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
                <label className="text-xs text-gray-500 block mb-2">الغرفة</label>
                <select
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                >
                  <option value="">اختر الغرفة</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.number}>{room.number} - {room.name}</option>
                  ))}
                </select>
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
                  <label className="text-xs text-gray-500 block mb-2">البالغين</label>
                  <input
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">الأطفال</label>
                  <input
                    type="number"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">سعر الليلة</span>
                  <span className="text-sm text-white font-bold">{pricePerNight.toLocaleString('ar-SA')} ريال</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">عدد الليالي</span>
                  <span className="text-sm text-white font-bold">{daysCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-sm text-[#E6C587] font-bold">الإجمالي</span>
                  <span className="text-lg text-[#E6C587] font-bold">{calculatedTotal.toLocaleString('ar-SA')} ريال</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (guestName && selectedRoomNumber) {
                    onAddReservation({
                      id: `res-${Date.now()}`,
                      guestName,
                      roomNumber: selectedRoomNumber,
                      checkIn,
                      checkOut,
                      status: 'upcoming',
                      amount: calculatedTotal,
                      guestId: guests.find(g => g.name === guestName)?.id || 'g1',
                      adultCount: adults,
                      childrenCount: children
                    });
                    setIsModalOpen(false);
                    setGuestName('');
                    setSelectedRoomNumber('');
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                تأكيد الحجز
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
