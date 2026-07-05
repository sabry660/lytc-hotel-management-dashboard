import React, { useState } from 'react';
import { BedDouble, Sparkles, AlertTriangle, Hammer, CheckCircle2, User, Filter, Layers, DollarSign } from 'lucide-react';
import { Room } from '../types';

interface RoomsSectionProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, status: Room['status']) => void;
}

export default function RoomsSection({ rooms, onUpdateRoomStatus }: RoomsSectionProps) {
  const [filter, setFilter] = useState<'all' | Room['status']>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

  const getStatusLabel = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'متاحة';
      case 'occupied': return 'مشغولة';
      case 'cleaning': return 'جاري التنظيف';
      case 'maintenance': return 'صيانة';
      case 'out_of_service': return 'خارج الخدمة';
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
      case 'occupied': return 'bg-blue-950/40 text-blue-400 border-blue-500/20';
      case 'cleaning': return 'bg-amber-950/40 text-amber-500 border-amber-500/20';
      case 'maintenance': return 'bg-red-950/40 text-red-400 border-red-500/20';
      case 'out_of_service': return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'occupied': return <User className="w-3.5 h-3.5" />;
      case 'cleaning': return <Sparkles className="w-3.5 h-3.5" />;
      case 'maintenance': return <Hammer className="w-3.5 h-3.5" />;
      case 'out_of_service': return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إدارة وتتبع وحدات الفندق</h1>
          <p className="text-gray-500 text-xs mt-1">تتبع حالة كافة الغرف والأجنحة الفاخرة، والتحكم في مهام الصيانة والتنظيف المباشر.</p>
        </div>
        
        {/* Quick Stats Ticker */}
        <div className="flex gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-lg">
            <span className="text-gray-500 ml-1.5">متاحة:</span>
            <span className="text-emerald-400 font-mono">{rooms.filter(r => r.status === 'available').length}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-lg">
            <span className="text-gray-500 ml-1.5">مشغولة:</span>
            <span className="text-blue-400 font-mono">{rooms.filter(r => r.status === 'occupied').length}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-lg">
            <span className="text-gray-500 ml-1.5">تنظيف:</span>
            <span className="text-amber-500 font-mono">{rooms.filter(r => r.status === 'cleaning').length}</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions Grid */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="text-[#D4AF37] w-4.5 h-4.5 ml-1" />
          <span className="text-xs font-bold text-gray-400 ml-2">فلترة حسب الحالة:</span>
          
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              filter === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            كافة الوحدات ({rooms.length})
          </button>
          
          {(['available', 'occupied', 'cleaning', 'maintenance', 'out_of_service'] as Room['status'][]).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1.5 ${
                filter === status ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {getStatusIcon(status)}
              <span>{getStatusLabel(status)}</span>
              <span className="text-[10px] opacity-70 font-mono">({rooms.filter(r => r.status === status).length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-all duration-300 relative cursor-pointer group flex flex-col justify-between h-72 ${
              selectedRoom?.id === room.id ? 'ring-1 ring-[#D4AF37] border-transparent shadow-[0_0_20px_rgba(212,175,55,0.15)]' : ''
            }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-gray-500 font-bold block">الطابق {room.floor}</span>
                <span className="text-2xl font-black font-mono text-white group-hover:text-[#E6C587] transition">{room.number}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(room.status)}`}>
                {getStatusIcon(room.status)}
                <span>{getStatusLabel(room.status)}</span>
              </span>
            </div>

            {/* Room Type */}
            <div className="my-3 space-y-1">
              <h3 className="text-sm font-bold text-gray-200">{room.type}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Layers size={13} className="text-[#D4AF37]" />
                <span>مساحة معيشة فاخرة بالكامل</span>
              </div>
            </div>

            {/* Occupying Guest Name */}
            <div className="bg-[#121212] border border-gray-800/60 p-2.5 rounded-lg text-xs mb-3 flex items-center justify-between">
              <span className="text-gray-500">النزيل المقيم:</span>
              <span className="font-bold text-gray-300">
                {room.guestName ? (
                  <span className="text-blue-400 flex items-center gap-1">
                    <User size={12} />
                    {room.guestName}
                  </span>
                ) : (
                  <span className="text-gray-600">جناح شاغر</span>
                )}
              </span>
            </div>

            {/* Amenities tags / Price row */}
            <div className="border-t border-gray-800/60 pt-3 flex items-center justify-between">
              <div className="text-right">
                <span className="text-[10px] text-gray-500 block">سعر الليلة</span>
                <span className="text-sm font-black font-mono text-[#E6C587]">
                  {room.pricePerNight.toLocaleString('ar-SA')} <span className="text-[10px] font-sans font-medium">ريال</span>
                </span>
              </div>
              <span className="text-[10px] text-[#D4AF37] hover:underline font-bold">التفاصيل والتحكم ←</span>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over / Modal Detail Panel */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 max-w-lg w-full relative space-y-6">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#E6C587]">تفاصيل الجناح رقم {selectedRoom.number}</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedRoom.type}</p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-xs bg-gray-900 border border-gray-800 hover:bg-gray-800 px-3 py-1.5 rounded-lg font-bold"
              >
                إغلاق
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-3 bg-[#121212] border border-gray-800/80 rounded-xl">
                <span className="text-gray-500 block">الطابق المناظر:</span>
                <span className="text-white text-sm font-bold block mt-1">{selectedRoom.floor} (جناح أرضي مرتفع)</span>
              </div>
              <div className="p-3 bg-[#121212] border border-gray-800/80 rounded-xl">
                <span className="text-gray-500 block">سعر الإقامة لكل ليلة:</span>
                <span className="text-[#E6C587] text-sm font-bold block mt-1">{selectedRoom.pricePerNight.toLocaleString('ar-SA')} ريال سعودي</span>
              </div>
            </div>

            {/* Occupancy details */}
            <div className="p-4 bg-gradient-to-l from-blue-950/20 to-transparent border-r-2 border-blue-500 rounded-lg">
              <h4 className="text-xs font-bold text-blue-400 mb-1">الوضع التشغيلي</h4>
              <p className="text-xs text-gray-300">
                {selectedRoom.guestName ? (
                  <span>الجناح مشغول حالياً بالنزيل المتميز: <strong className="text-white font-bold">{selectedRoom.guestName}</strong></span>
                ) : (
                  <span>الجناح شاغر وجاهز لاستقبال ضيوف جدد فوراً بعد التنظيف المباشر.</span>
                )}
              </p>
            </div>

            {/* List of Amenities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#E6C587]">المميزات الاستثنائية والخدمات التابعة:</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-[#121212] border border-gray-800 rounded-md text-[10px] text-gray-300">
                    ✨ {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Modification Controls */}
            <div className="space-y-3 pt-2 border-t border-gray-800">
              <h4 className="text-xs font-bold text-gray-400">تغيير حالة الوحدة فوراً:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['available', 'occupied', 'cleaning', 'maintenance', 'out_of_service'] as Room['status'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateRoomStatus(selectedRoom.id, status);
                      setSelectedRoom(prev => prev ? { ...prev, status } : null);
                    }}
                    className={`px-1 py-2 rounded-lg text-[10px] font-bold text-center border transition-all duration-200 ${
                      selectedRoom.status === status
                        ? 'bg-[#D4AF37] border-transparent text-black shadow-lg scale-105'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
