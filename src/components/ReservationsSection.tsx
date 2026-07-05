import React, { useState } from 'react';
import { Calendar, User, Plus, Search, CheckCircle2, XCircle, ArrowRightLeft, DollarSign, Users, AlertCircle, Trash2 } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Reservation Form States
  const [guestName, setGuestName] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [checkIn, setCheckIn] = useState('2026-07-05');
  const [checkOut, setCheckOut] = useState('2026-07-12');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

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
            الحجوزات القادمة ({reservations.filter(r => r.status === 'upcoming').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none placeholder-gray-500"
            placeholder="البحث باسم النزيل أو رقم الغرفة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
        </div>
      </div>

      {/* Booking visual calendar grid */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-[#E6C587]">المخطط الأسبوعي للإشغال والتسكين</h3>
        
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[650px] space-y-4">
            {/* Simple visual calendar representing days */}
            <div className="grid grid-cols-8 gap-1.5 text-center text-[10px] text-gray-500 font-bold border-b border-gray-800 pb-3" dir="ltr">
              <div className="text-right text-[#D4AF37] font-sans">الغرفة / اليوم</div>
              <div>5 يوليو</div>
              <div>6 يوليو</div>
              <div>7 يوليو</div>
              <div>8 يوليو</div>
              <div>9 يوليو</div>
              <div>10 يوليو</div>
              <div>11 يوليو</div>
            </div>

            <div className="space-y-3">
              {rooms.slice(0, 5).map((room, idx) => {
                // Find reservation in this room
                const roomRes = reservations.find(r => r.roomNumber === room.number && r.status === 'checked_in');
                return (
                  <div key={room.id} className="grid grid-cols-8 gap-1.5 items-center font-mono" dir="ltr">
                    <div className="text-right text-xs font-bold text-gray-400 font-sans border-r border-gray-800 pr-1">
                      ج {room.number}
                    </div>
                    {roomRes ? (
                      <div className="col-span-7 bg-[#1E40AF]/30 border border-blue-500/30 p-2 rounded-lg text-right text-[10px] text-white flex justify-between items-center font-sans">
                        <span className="font-bold">👤 {roomRes.guestName}</span>
                        <span className="text-gray-400 text-[9px]">حتى {roomRes.checkOut}</span>
                      </div>
                    ) : (
                      <div className="col-span-7 bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-lg text-right text-[10px] text-emerald-400 font-sans">
                        <span>✨ متاح تماماً للحجز الفوري</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Reservation Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReservations.map((res) => (
          <div key={res.id} className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 flex flex-col justify-between hover:border-[#D4AF37]/30 transition duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded text-[9px] font-mono">
                  {res.id}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{res.guestName}</h3>
                <span className="text-xs text-gray-500">مجموع المرافقين: {res.adultCount} بالغين و {res.childrenCount} أطفال</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                res.status === 'checked_in' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' :
                res.status === 'checked_out' ? 'bg-gray-900 text-gray-400 border-gray-800' :
                'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/20'
              }`}>
                {res.status === 'checked_in' ? 'مقيم حالياً' :
                 res.status === 'checked_out' ? 'مغادر' :
                 'حجز مؤكد قادم'}
              </span>
            </div>

            {/* Check-In / Check-Out Row */}
            <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-[#121212] border border-gray-800/60 rounded-xl text-xs font-semibold">
              <div>
                <span className="text-gray-500 block">تاريخ الدخول:</span>
                <span className="text-white block mt-1 font-mono">📅 {res.checkIn}</span>
              </div>
              <div>
                <span className="text-gray-500 block">تاريخ المغادرة:</span>
                <span className="text-white block mt-1 font-mono">📅 {res.checkOut}</span>
              </div>
            </div>

            {/* Price and Action Buttons */}
            <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 block">التكلفة الإجمالية</span>
                <span className="text-base font-black font-mono text-[#E6C587]">
                  {res.amount.toLocaleString('ar-SA')} <span className="text-[10px] font-sans">ريال</span>
                </span>
              </div>

              {/* Functional State Buttons */}
              <div className="flex gap-2 text-xs">
                {res.status === 'upcoming' && (
                  <button
                    onClick={() => onUpdateReservationStatus(res.id, 'checked_in')}
                    className="px-3.5 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/40 rounded-lg font-bold transition"
                  >
                    تسجيل دخول النزيل
                  </button>
                )}
                {res.status === 'checked_in' && (
                  <button
                    onClick={() => onUpdateReservationStatus(res.id, 'checked_out')}
                    className="px-3.5 py-1.5 bg-blue-950/40 text-blue-400 border border-blue-500/30 hover:bg-blue-900/40 rounded-lg font-bold transition"
                  >
                    تسجيل الخروج والفوترة
                  </button>
                )}
                {res.status !== 'cancelled' && res.status !== 'checked_out' && (
                  <button
                    onClick={() => onUpdateReservationStatus(res.id, 'cancelled')}
                    className="p-1.5 bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-900/30 rounded-lg transition"
                    title="إلغاء الحجز"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Reservation Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 max-w-lg w-full relative space-y-6">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#E6C587]">إنشاء حجز وإشغال جناح جديد</h3>
                <p className="text-xs text-gray-500 mt-1">الرجاء إدخال بيانات النزيل واختيار الغرفة والمدة الزمنية بدقة.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs bg-gray-900 border border-gray-800 hover:bg-gray-800 px-3 py-1.5 rounded-lg"
              >
                إلغاء
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4 text-xs font-bold">
              {/* Guest Name */}
              <div className="space-y-1.5">
                <label className="text-gray-400 block">اسم النزيل الثلاثي:</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  placeholder="مثال: الشيخ عبد العزيز العتيبي"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              {/* Room Selection */}
              <div className="space-y-1.5">
                <label className="text-gray-400 block">اختر الغرفة / الجناح المتاح:</label>
                <select
                  required
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                >
                  <option value="">-- اختر من القائمة --</option>
                  {rooms.filter(r => r.status === 'available').map(room => (
                    <option key={room.id} value={room.number}>
                      غرفة {room.number} - {room.type} ({room.pricePerNight} ريال/ليلة)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">تاريخ الدخول:</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">تاريخ المغادرة:</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* Accompanists count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">عدد البالغين:</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-white focus:outline-none"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">عدد الأطفال:</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-white focus:outline-none"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="p-4 bg-amber-950/10 border border-[#D4AF37]/20 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">سعر الليلة:</span>
                  <span className="text-white font-mono">{pricePerNight.toLocaleString('ar-SA')} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">عدد ليالي الإقامة:</span>
                  <span className="text-white font-mono">{daysCount} ليالي</span>
                </div>
                <div className="border-t border-gray-800 my-2 pt-2 flex justify-between text-sm">
                  <span className="text-[#E6C587] font-bold">التكلفة التقديرية الإجمالية:</span>
                  <span className="text-[#E6C587] font-black font-mono">{calculatedTotal.toLocaleString('ar-SA')} ريال</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold rounded-xl text-xs transition duration-200"
              >
                تأكيد وتسجيل الحجز رسمياً
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
