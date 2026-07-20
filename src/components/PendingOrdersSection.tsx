import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock, Search, XCircle, AlertCircle, Building, DollarSign, CheckCircle, X, Loader2
} from 'lucide-react';
import { apiService, PendingOrdersResponse } from '../services/api';

export default function PendingOrdersSection() {
  const [roomServiceOrders, setRoomServiceOrders] = useState<PendingOrdersResponse[]>([]);
  const [restaurantOrders, setRestaurantOrders] = useState<PendingOrdersResponse[]>([]);
  const [cafeOrders, setCafeOrders] = useState<PendingOrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'room-service' | 'restaurant' | 'cafe'>('all');

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roomService, restaurant, cafe] = await Promise.all([
        apiService.getRoomServicePendingOrders(),
        apiService.getRestaurantPendingOrders(),
        apiService.getCafePendingOrders(),
      ]);

      setRoomServiceOrders(roomService || []);
      setRestaurantOrders(restaurant || []);
      setCafeOrders(cafe || []);
    } catch (error: any) {
      console.error('Failed to load pending orders:', error);
      setError('فشل تحميل الطلبات المعلقة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, section: string, status: string) => {
    try {
      if (section === 'room-service') {
        await apiService.updateRoomServiceOrderStatus(orderId, status);
      } else if (section === 'restaurant') {
        await apiService.updateRestaurantOrderStatus(orderId, status);
      } else if (section === 'cafe') {
        await apiService.updateCafeOrderStatus(orderId, status);
      }
      loadPendingOrders();
    } catch (error) {
      // Error handling
    }
  };

  // Get all orders based on active tab
  const getAllOrders = () => {
    const allOrders = [
      ...(roomServiceOrders || []).map(o => ({ ...o, section: 'room-service' })),
      ...(restaurantOrders || []).map(o => ({ ...o, section: 'restaurant' })),
      ...(cafeOrders || []).map(o => ({ ...o, section: 'cafe' })),
    ];

    if (activeTab === 'all') return allOrders;
    return allOrders.filter(o => o.section === activeTab);
  };

  // Filter orders based on search
  const filteredOrders = getAllOrders().filter(order => {
    const matchesSearch = order.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalOrders = (roomServiceOrders || []).length + (restaurantOrders || []).length + (cafeOrders || []).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">الطلبات المعلقة</h1>
          <p className="text-gray-500 text-xs mt-1">عرض وإدارة الطلبات المعلقة لجميع الأقسام</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0b0b0b] border border-gray-900 px-4 py-2 rounded-xl">
          <Clock size={16} className="text-[#E6C587]" />
          <span className="text-sm text-white font-bold">إجمالي: {totalOrders}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#0b0b0b] border border-gray-900 p-2 rounded-xl">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'all' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          الكل ({totalOrders})
        </button>
        <button
          onClick={() => setActiveTab('room-service')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'room-service' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          خدمة الغرف ({roomServiceOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('restaurant')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'restaurant' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          المطعم ({restaurantOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('cafe')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'cafe' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          المقهى ({cafeOrders.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الطلبات المعلقة</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadPendingOrders}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد طلبات معلقة</h3>
          <p className="text-xs text-gray-600 mb-4">لا يوجد حالياً طلبات معلقة</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">رقم الطلب</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">اسم الضيف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الغرفة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">القسم</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">العناصر</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المبلغ</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الوقت</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الحالة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order: any) => (
                <tr key={`${order.section}-${order.orderId}`} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white">{order.orderId}</td>
                  <td className="py-3 text-sm text-white">{order.guestName}</td>
                  <td className="py-3 text-sm text-white flex items-center gap-2">
                    <Building size={14} />
                    {order.roomNumber}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      order.section === 'room-service' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                      order.section === 'restaurant' ? 'bg-purple-950/20 text-purple-400 border border-purple-500/30' :
                      'bg-orange-950/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {order.section === 'room-service' ? 'خدمة الغرف' : order.section === 'restaurant' ? 'المطعم' : 'المقهى'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-400 max-w-xs truncate">{order.items}</td>
                  <td className="py-3 text-sm text-[#E6C587] font-bold flex items-center gap-2">
                    <DollarSign size={14} />
                    {order.totalAmount.toLocaleString('ar-SA')} ريال
                  </td>
                  <td className="py-3 text-sm text-gray-400">{order.orderTime}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-yellow-950/20 text-yellow-400 border border-yellow-500/30">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.orderId, order.section, 'COMPLETED')}
                        className="p-1.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/30 transition"
                      >
                        <CheckCircle size={14} className="text-emerald-400" />
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.orderId, order.section, 'CANCELLED')}
                        className="p-1.5 bg-red-950/20 border border-red-500/30 rounded-lg hover:bg-red-900/30 transition"
                      >
                        <X size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
