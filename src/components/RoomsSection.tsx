import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BedDouble, Sparkles, AlertTriangle, Hammer, CheckCircle2, User, Filter, Layers, 
  DollarSign, Grid3X3, List, Search, ArrowUpDown, ChevronLeft, Eye, Edit, 
  Calendar, MapPin, Users, Clock, MoreVertical, X, Save, Building2, Image as ImageIcon, Star, Loader2, Plus
} from 'lucide-react';
import { Room } from '../types';
import { apiService, RoomResponse } from '../services/api';

interface RoomsSectionProps {
  rooms?: Room[];
  onUpdateRoomStatus?: (roomId: string, status: Room['status']) => void;
  onUpdateRoom?: (updatedRoom: Room) => void;
}

export default function RoomsSection({ rooms: initialRooms = [], onUpdateRoomStatus, onUpdateRoom }: RoomsSectionProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Room['status']>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'price' | 'floor' | 'status'>('number');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Create Room Modal State
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    maxAdults: 2,
    maxKids: 0,
    description: '',
    floor: 2,
    price: 0,
    status: 'AVAILABLE' as 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE',
  });
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createRoomError, setCreateRoomError] = useState<string | null>(null);

  const floors = [2, 3, 4, 5];

  useEffect(() => {
    loadRooms();
  }, [filter, selectedFloor]);

  const loadRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getRooms(
        filter === 'all' ? undefined : filter as any,
        selectedFloor === 'all' ? undefined : selectedFloor,
        0,
        50
      );
      
      // Transform backend response to Room format
      const transformedRooms = (response.content || []).map((room: RoomResponse) => ({
        id: room.id.toString(),
        number: room.roomNumber,
        status: room.status as Room['status'],
        floor: room.floor,
        pricePerNight: parseFloat(room.price),
        type: room.description || 'Standard',
        name: `Room ${room.roomNumber}`,
        maxAdults: room.maxAdults,
        maxKids: room.maxKids,
        image: '',
      }));
      
      setRooms(transformedRooms);
    } catch (error: any) {
      if (error.message && error.message.includes('NetworkError')) {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else {
        setError('فشل تحميل الغرف. الرجاء المحاولة مرة أخرى.');
      }
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.roomNumber || newRoom.price <= 0) {
      setCreateRoomError('يرجى إدخال رقم الغرفة والسعر');
      return;
    }

    setIsCreatingRoom(true);
    setCreateRoomError(null);
    try {
      await apiService.createRoom({
        roomNumber: newRoom.roomNumber,
        maxAdults: newRoom.maxAdults,
        maxKids: newRoom.maxKids,
        description: newRoom.description,
        floor: newRoom.floor,
        price: newRoom.price,
      });
      
      // Reset form and close modal
      setNewRoom({
        roomNumber: '',
        maxAdults: 2,
        maxKids: 0,
        description: '',
        floor: 2,
        price: 0,
        status: 'AVAILABLE',
      });
      setCreateRoomModalOpen(false);
      
      // Reload rooms
      loadRooms();
    } catch (error: any) {
      console.error('Failed to create room:', error);
      setCreateRoomError('فشل إنشاء الغرفة. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = filter === 'all' || room.status === filter;
    const matchesFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    const matchesSearch = searchQuery === '' || 
      room.number.includes(searchQuery) || 
      room.name.includes(searchQuery) ||
      room.type.includes(searchQuery);
    return matchesFilter && matchesFloor && matchesSearch;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'number': return a.number.localeCompare(b.number);
      case 'price': return b.pricePerNight - a.pricePerNight;
      case 'floor': return b.floor - a.floor;
      case 'status': return a.status.localeCompare(b.status);
      default: return 0;
    }
  });

  const paginatedRooms = sortedRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);

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

  const handleEditRoom = (room: Room) => {
    // Edit functionality removed as per requirements
  };

  const handleSaveRoom = () => {
    // Edit functionality removed as per requirements
  };

  const handleUpdateRoomStatus = async (roomId: string, status: Room['status']) => {
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return;

      // If trying to book, check current status first
      if (status === 'available') {
        if (room.status === 'available') {
          alert('الغرفة متاحة بالفعل');
          return;
        }
        
        const confirmBooking = confirm(
          `حالة الغرفة الحالية: ${getStatusLabel(room.status)}\n\nهل تريد تغيير الحالة إلى "متاحة"؟`
        );
        
        if (!confirmBooking) {
          return;
        }
      }

      // Map frontend status to backend status
      const backendStatus = status.toUpperCase() as 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
      
      console.log('Updating room status:', roomId, 'to:', backendStatus);
      await apiService.patchRoom(parseInt(roomId), { status: backendStatus });
      
      // Reload rooms to get updated state from backend
      await loadRooms();
      
      // Show success message
      alert(`تم تغيير حالة الغرفة بنجاح إلى "${getStatusLabel(status)}"`);
    } catch (error) {
      console.error('Failed to update room status:', error);
      alert('فشل تحديث حالة الغرفة. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الغرفة؟')) {
      return;
    }

    try {
      await apiService.deleteRoom(parseInt(roomId));
      await loadRooms();
    } catch (error) {
      console.error('Failed to delete room:', error);
      alert('فشل حذف الغرفة. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleBulkAction = (action: string) => {
    selectedRooms.forEach(roomId => {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        if (action === 'available') {
          handleUpdateRoomStatus(roomId, 'available');
        } else if (action === 'maintenance') {
          handleUpdateRoomStatus(roomId, 'maintenance');
        }
      }
    });
    setSelectedRooms(new Set());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-900 pb-5">
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
        
        {/* Add Room Button */}
        <button
          onClick={() => setCreateRoomModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
        >
          <Plus size={16} />
          <span>إضافة غرفة</span>
        </button>
      </div>

      {/* Floor Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">اختر الطابق:</span>
        <button
          onClick={() => setSelectedFloor('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
            selectedFloor === 'all' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
              : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white hover:border-[#D4AF37]/30'
          }`}
        >
          جميع الطوابق
        </button>
        {floors.map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
              selectedFloor === floor 
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white hover:border-[#D4AF37]/30'
            }`}
          >
            الطابق {floor}
          </button>
        ))}
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="بحث عن غرفة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none w-48"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2">
            <Filter className="text-[#D4AF37] w-4 h-4" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
                filter === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              الكل
            </button>
            {(['available', 'occupied', 'cleaning', 'maintenance'] as Room['status'][]).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1.5 ${
                  filter === status ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                {getStatusIcon(status)}
                <span>{getStatusLabel(status)}</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#121212] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="number">ترتيب: الرقم</option>
            <option value="price">ترتيب: السعر</option>
            <option value="floor">ترتيب: الطابق</option>
            <option value="status">ترتيب: الحالة</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-[#121212] border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedRooms.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{selectedRooms.size} محدد</span>
              <button
                onClick={() => handleBulkAction('available')}
                className="px-3 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-950/60"
              >
                تعيين متاح
              </button>
              <button
                onClick={() => handleBulkAction('maintenance')}
                className="px-3 py-1.5 bg-red-950/40 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-950/60"
              >
                صيانة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Room Cards - Grid View */}
      {viewMode === 'grid' && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
              <X size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الغرف</h3>
              <p className="text-xs text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadRooms}
                className="px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : paginatedRooms.length === 0 ? (
            <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
              <BedDouble size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد غرف</h3>
              <p className="text-xs text-gray-600 mb-4">لم يتم العثور على غرف تطابق البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="relative bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 group">
                {/* Room Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent" />
                  
                  {/* Status Badge - More Prominent */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-lg ${getStatusColor(room.status)}`}>
                      {getStatusIcon(room.status)}
                      <span>{getStatusLabel(room.status)}</span>
                    </span>
                  </div>

                  {/* Floor Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-[#E6C587] border border-[#D4AF37]/20">
                      الطابق {room.floor}
                    </span>
                  </div>

                  {/* Status Indicator Bar - Bottom */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                    room.status === 'available' ? 'bg-emerald-500' :
                    room.status === 'occupied' ? 'bg-blue-500' :
                    room.status === 'cleaning' ? 'bg-amber-500' :
                    room.status === 'maintenance' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                </div>

                {/* Room Info */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-[#E6C587] transition">{room.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{room.type}</p>
                      </div>
                      <span className="text-xl font-black font-mono text-[#E6C587]">{room.number}</span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={14} className="text-[#D4AF37]" />
                      <span>{room.capacity} نزلاء</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign size={14} className="text-[#D4AF37]" />
                      <span>{room.pricePerNight.toLocaleString('ar-SA')} ريال</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} className="text-[#D4AF37]" />
                      <span>{room.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Layers size={14} className="text-[#D4AF37]" />
                      <span>إشغال {room.occupancyRate}%</span>
                    </div>
                  </div>

                  {/* Guest Info */}
                  {room.guestName && (
                    <div className="bg-[#121212] border border-gray-800/60 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-950/40 flex items-center justify-center">
                        <User size={14} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 block">النزيل المقيم</span>
                        <span className="text-xs font-bold text-white">{room.guestName}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-800/60">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#121212] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#D4AF37]/30 transition"
                    >
                      <Eye size={14} />
                      <span>التفاصيل</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
            </div>
          )}
        </>
      )}

      {/* Room Cards - List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {paginatedRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Room Image */}
                <div className="relative h-48 sm:h-auto sm:w-64 overflow-hidden">
                  <img 
                    src={room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent sm:bg-gradient-to-l" />
                  
                  <div className="absolute top-3 right-3 sm:top-3 sm:right-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${getStatusColor(room.status)}`}>
                      {getStatusIcon(room.status)}
                      <span>{getStatusLabel(room.status)}</span>
                    </span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-white">{room.name}</h3>
                        <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] font-bold text-[#D4AF37]">
                          {room.number}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{room.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-[#E6C587]">
                        {room.pricePerNight.toLocaleString('ar-SA')}
                      </span>
                      <span className="text-xs text-gray-500 block">ريال / ليلة</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2">{room.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-[#D4AF37]" />
                      <span>الطابق {room.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={14} className="text-[#D4AF37]" />
                      <span>{room.capacity} نزلاء</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} className="text-[#D4AF37]" />
                      <span>{room.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Layers size={14} className="text-[#D4AF37]" />
                      <span>إشغال {room.occupancyRate}%</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.filter(a => a).slice(0, 4).map((amenity, idx) => (
                      <span key={`${room.id}-amenity-${idx}`} className="px-2 py-1 bg-[#121212] border border-gray-800 rounded-md text-[10px] text-gray-400">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-[#121212] border border-gray-800 rounded-md text-[10px] text-gray-400">
                        +{room.amenities.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-800/60">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#D4AF37]/30 transition"
                    >
                      <Eye size={14} />
                      <span>التفاصيل</span>
                    </button>
                    <button
                      onClick={() => handleUpdateRoomStatus(room.id, 'available')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-xs font-bold text-emerald-400 hover:bg-emerald-950/60 transition"
                    >
                      <Calendar size={14} />
                      <span>حجز</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-950/40 border border-red-500/20 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/60 transition"
                    >
                      <Trash2 size={14} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-[#121212] border border-gray-800 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg text-xs font-bold transition ${
                currentPage === page 
                  ? 'bg-[#D4AF37] text-black' 
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-[#121212] border border-gray-800 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="rotate-180" />
          </button>
        </div>
      )}

      {/* Room Details Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full relative space-y-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              
              <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#E6C587]">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedRoom.type} • جناح {selectedRoom.number}</p>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Room Images */}
              <div className="grid grid-cols-2 gap-4">
                {selectedRoom.images && selectedRoom.images.length > 0 ? (
                  selectedRoom.images.filter(url => url).map((image, idx) => (
                    <img
                      key={`${selectedRoom.id}-image-${idx}`}
                      src={image}
                      alt={`${selectedRoom.name} ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800';
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-2 h-48 bg-[#121212] rounded-xl flex items-center justify-center text-gray-500 text-sm">
                    لا توجد صور متاحة
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <h4 className="text-sm font-bold text-[#E6C587] mb-2">الوصف</h4>
                <p className="text-sm text-gray-300">{selectedRoom.description || 'لا يوجد وصف متاح'}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                <div className="p-3 bg-[#121212] border border-gray-800/80 rounded-xl">
                  <span className="text-gray-500 block">الطابق</span>
                  <span className="text-white text-sm font-bold block mt-1">{selectedRoom.floor || '-'}</span>
                </div>
                <div className="p-3 bg-[#121212] border border-gray-800/80 rounded-xl">
                  <span className="text-gray-500 block">السعر</span>
                  <span className="text-[#E6C587] text-sm font-bold block mt-1">{selectedRoom.pricePerNight ? selectedRoom.pricePerNight.toLocaleString('ar-SA') : '-'} ريال</span>
                </div>
                <div className="p-3 bg-[#121212] border border-gray-800/80 rounded-xl">
                  <span className="text-gray-500 block">السعة</span>
                  <span className="text-white text-sm font-bold block mt-1">{selectedRoom.capacity ? `${selectedRoom.capacity} نزلاء` : '-'}</span>
                </div>
                <div className="p-3 bg-[#121212] border border-gray-800/80 rounded-xl">
                  <span className="text-gray-500 block">معدل الإشغال</span>
                  <span className="text-white text-sm font-bold block mt-1">{selectedRoom.occupancyRate !== undefined ? `${selectedRoom.occupancyRate}%` : '-'}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#E6C587]">المميزات والخدمات</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
                    selectedRoom.amenities.filter(a => a).map((amenity, idx) => (
                      <span key={`${selectedRoom.id}-amenity-${idx}`} className="px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-lg text-xs text-gray-300">
                        {amenity}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">لا توجد مميزات متاحة</span>
                  )}
                </div>
              </div>

              {/* Maintenance Log */}
              {selectedRoom.maintenanceLog && selectedRoom.maintenanceLog.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#E6C587]">سجل الصيانة</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRoom.maintenanceLog.map((log, idx) => (
                      <div key={`${selectedRoom.id}-maintenance-${idx}`} className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-white font-bold">{log.issue}</span>
                          <span className="text-[10px] text-gray-500">{log.date}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">{log.technician}</span>
                          <span className={`px-2 py-0.5 rounded ${log.status === 'completed' ? 'bg-emerald-950/20 text-emerald-400' : 'bg-amber-950/20 text-amber-400'}`}>
                            {log.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                          </span>
                        </div>
                        <div className="text-xs text-[#E6C587] mt-1">{log.cost.toLocaleString('ar-SA')} ريال</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cleaning Log */}
              {selectedRoom.cleaningLog && selectedRoom.cleaningLog.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#E6C587]">سجل التنظيف</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRoom.cleaningLog.map((log, idx) => (
                      <div key={`${selectedRoom.id}-cleaning-${idx}`} className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-white font-bold">{log.staff}</span>
                          <span className="text-[10px] text-gray-500">{log.date}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">المدة: {log.duration} دقيقة</span>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400" />
                            <span className="text-amber-400">{log.quality}/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Revenue */}
              {selectedRoom.roomRevenue && (
                <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                  <h4 className="text-sm font-bold text-[#E6C587] mb-2">إيرادات الغرفة</h4>
                  <div className="text-2xl font-black text-white font-mono">{selectedRoom.roomRevenue.toLocaleString('ar-SA')} <span className="text-sm text-[#E6C587]">ريال</span></div>
                  <div className="text-xs text-gray-500 mt-1">إجمالي الإيرادات لهذه الغرفة</div>
                </div>
              )}

              {/* Status Modification */}
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <h4 className="text-sm font-bold text-gray-400">تغيير الحالة</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['available', 'occupied', 'cleaning', 'maintenance', 'out_of_service'] as Room['status'][]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleUpdateRoomStatus(selectedRoom.id, status);
                        setSelectedRoom(prev => prev ? { ...prev, status } : null);
                      }}
                      className={`px-2 py-3 rounded-lg text-xs font-bold text-center border transition-all duration-200 ${
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      <AnimatePresence>
        {editModalOpen && editingRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full relative space-y-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              
              <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#E6C587]">تعديل الجناح</h3>
                  <p className="text-xs text-gray-500 mt-1">تعديل معلومات الجناح {editingRoom.number}</p>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Room Number */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">رقم الغرفة</label>
                  <input
                    type="text"
                    value={editingRoom.number || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Room Name */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">اسم الغرفة</label>
                  <input
                    type="text"
                    value={editingRoom.name || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">الوصف</label>
                  <textarea
                    value={editingRoom.description || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                    rows={3}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">سعر الليلة (ريال)</label>
                    <input
                      type="number"
                      value={editingRoom.pricePerNight || 0}
                      onChange={(e) => setEditingRoom({ ...editingRoom, pricePerNight: Number(e.target.value) })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">السعة (نزلاء)</label>
                    <input
                      type="number"
                      value={editingRoom.capacity || 0}
                      onChange={(e) => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">نوع الغرفة</label>
                  <select
                    value={editingRoom.type}
                    onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value as any })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    <option value="جناح ملكي">جناح ملكي</option>
                    <option value="جناح ديلوكس">جناح ديلوكس</option>
                    <option value="بنتهاوس فاخر">بنتهاوس فاخر</option>
                    <option value="غرفة بريميوم دبل">غرفة بريميوم دبل</option>
                    <option value="غرفة كلاسيك">غرفة كلاسيك</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">الحالة</label>
                  <select
                    value={editingRoom.status}
                    onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value as any })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    <option value="available">متاحة</option>
                    <option value="occupied">مشغولة</option>
                    <option value="cleaning">جاري التنظيف</option>
                    <option value="maintenance">صيانة</option>
                    <option value="out_of_service">خارج الخدمة</option>
                  </select>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">المميزات (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={editingRoom.amenities && editingRoom.amenities.length > 0 ? editingRoom.amenities.filter(a => a).join(', ') : ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a) })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">روابط الصور (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={editingRoom.images && editingRoom.images.length > 0 ? editingRoom.images.filter(url => url).join(', ') : ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, images: e.target.value.split(',').map(url => url.trim()).filter(url => url) })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 padding-top-4 border-t border-gray-800 pt-4">
                <button
                  onClick={handleSaveRoom}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
                >
                  <Save size={16} />
                  <span>حفظ التغييرات</span>
                </button>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#121212] border border-gray-800 text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-700 transition-all duration-300"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Create Room Modal */}
        <AnimatePresence>
          {createRoomModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setCreateRoomModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0b0b0b] border border-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#E6C587]">إضافة غرفة جديدة</h2>
                    <button
                      onClick={() => setCreateRoomModalOpen(false)}
                      className="text-gray-500 hover:text-white transition"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {createRoomError && (
                    <div className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {createRoomError}
                    </div>
                  )}

                  {/* Room Number */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">رقم الغرفة *</label>
                    <input
                      type="text"
                      value={newRoom.roomNumber}
                      onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      placeholder="مثال: 101"
                      disabled={isCreatingRoom}
                    />
                  </div>

                  {/* Floor */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">الطابق</label>
                    <select
                      value={newRoom.floor}
                      onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      disabled={isCreatingRoom}
                    >
                      {floors.map((floor) => (
                        <option key={floor} value={floor}>الطابق {floor}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">السعر لليلة *</label>
                    <input
                      type="number"
                      value={newRoom.price}
                      onChange={(e) => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      placeholder="مثال: 500"
                      disabled={isCreatingRoom}
                    />
                  </div>

                  {/* Max Adults */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">أقصى عدد بالغين</label>
                    <input
                      type="number"
                      value={newRoom.maxAdults}
                      onChange={(e) => setNewRoom({ ...newRoom, maxAdults: parseInt(e.target.value) || 1 })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      min="1"
                      disabled={isCreatingRoom}
                    />
                  </div>

                  {/* Max Kids */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">أقصى عدد أطفال</label>
                    <input
                      type="number"
                      value={newRoom.maxKids}
                      onChange={(e) => setNewRoom({ ...newRoom, maxKids: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      min="0"
                      disabled={isCreatingRoom}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2">الوصف</label>
                    <textarea
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                      rows={3}
                      placeholder="وصف الغرفة..."
                      disabled={isCreatingRoom}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={handleCreateRoom}
                      disabled={isCreatingRoom}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingRoom ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      <span>{isCreatingRoom ? 'جاري الإنشاء...' : 'إضافة الغرفة'}</span>
                    </button>
                    <button
                      onClick={() => setCreateRoomModalOpen(false)}
                      disabled={isCreatingRoom}
                      className="flex-1 px-6 py-3 bg-[#121212] border border-gray-800 text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
