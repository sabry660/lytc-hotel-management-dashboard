import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Coffee, ChevronLeft, Check, Play, DollarSign, Clock, CheckCircle2, 
  Utensils, Grid3X3, List, Filter, Search, Plus, X, Save, Download, 
  Printer, TrendingUp, BarChart3, Star, Award, Timer, AlertCircle,
  Package, ChefHat, Table, Calendar, Users, Loader2, Bed
} from 'lucide-react';
import { RestaurantOrder } from '../types';
import CreateOrderModal from './CreateOrderModal';
import { apiService } from '../services/api';

interface RoomServiceSectionProps {
  orders?: RestaurantOrder[];
  onUpdateOrderStatus?: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function RoomServiceSection({ orders: initialOrders = [], onUpdateOrderStatus }: RoomServiceSectionProps) {
  const [viewMode, setViewMode] = useState<'orders' | 'rooms' | 'menu' | 'inventory' | 'kitchen' | 'stats' | 'pending'>('orders');
  const [filter, setFilter] = useState<'all' | RestaurantOrder['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
    loadStats();
    loadPendingOrders();
    loadMenu();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.getRoomServiceStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats(null);
    }
  };

  const loadPendingOrders = async () => {
    try {
      const response = await apiService.getRoomServicePendingOrders();
      setPendingOrders(response || []);
    } catch (error) {
      console.error('Failed to load pending orders:', error);
      setPendingOrders([]);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await apiService.getRoomServiceMenu(0, 50);
      setMenuItems(response.content || []);
    } catch (error) {
      console.error('Failed to load menu:', error);
      setMenuItems([]);
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getGuestOrders('101', 0, 50);
      const transformedOrders = response.content || [];
      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrderSuccess = () => {
    loadOrders();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      console.log('Updating room service order status:', orderId, status);
      await apiService.updateRoomServiceOrderStatus(parseInt(orderId), status);
      loadOrders();
      loadPendingOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('فشل تحديث حالة الطلب. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleUpdateMenuItem = async (id: number, itemData: any) => {
    try {
      console.log('Updating room service menu item:', id, itemData);
      await apiService.updateRoomServiceMenuItem(id, itemData);
      loadMenu();
    } catch (error) {
      console.error('Failed to update menu item:', error);
      alert('فشل تحديث العنصر. الرجاء المحاولة مرة أخرى.');
    }
  };

  const totalRoomServiceSales = orders.reduce((sum, order) => sum + order.total, 0);
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: RestaurantOrder['status']) => {
    switch (status) {
      case 'ordered': return 'bg-blue-950/40 text-blue-400 border border-blue-500/20';
      case 'preparing': return 'bg-amber-950/40 text-amber-500 border border-amber-500/20';
      case 'delivered': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
      case 'completed': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-gray-800 text-gray-400 border border-gray-700';
    }
  };

  const getStatusLabel = (status: RestaurantOrder['status']) => {
    switch (status) {
      case 'ordered': return 'تم الطلب';
      case 'preparing': return 'قيد التجهيز';
      case 'delivered': return 'تم التوصيل';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587] flex items-center gap-2">
            <Bed size={24} className="text-[#D4AF37]" />
            خدمة الغرف
          </h1>
          <p className="text-gray-500 text-xs mt-1">إدارة طلبات خدمة الغرف والقائمة</p>
        </div>
        <button 
          onClick={() => setIsCreateOrderModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
        >
          <Plus size={15} />
          <span>طلب جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي الطلبات</span>
            <div className="text-lg font-bold text-white font-mono">{filteredOrders.length}</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
            <Utensils size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">طلبات قيد التجهيز</span>
            <div className="text-lg font-bold text-white font-mono">{filteredOrders.filter(o => o.status === 'preparing').length}</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Timer size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">الطلبات المسلمة</span>
            <div className="text-lg font-bold text-white font-mono">{filteredOrders.filter(o => o.status === 'delivered').length}</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي المبيعات</span>
            <div className="text-lg font-bold text-[#E6C587] font-mono">{totalRoomServiceSales.toLocaleString('ar-SA')}</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <DollarSign size={16} />
          </div>
        </div>
      </div>

      {/* View Mode Toggles */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
        {[
          { id: 'orders', label: 'الطلبات', icon: <Utensils size={14} /> },
          { id: 'rooms', label: 'الغرف', icon: <Bed size={14} /> },
          { id: 'menu', label: 'القائمة', icon: <ChefHat size={14} /> },
          { id: 'inventory', label: 'المخزون', icon: <Package size={14} /> },
          { id: 'kitchen', label: 'المطبخ', icon: <Timer size={14} /> },
          { id: 'stats', label: 'الإحصائيات', icon: <BarChart3 size={14} /> },
          { id: 'pending', label: 'المعلقة', icon: <Clock size={14} /> }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === mode.id ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Orders View */}
      {viewMode === 'orders' && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الطلبات</h3>
              <p className="text-xs text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
              <Utensils size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد طلبات حالياً</h3>
              <p className="text-xs text-gray-600 mb-4">ابدأ بإضافة طلب جديد</p>
              <button
                onClick={() => setIsCreateOrderModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
              >
                إضافة طلب
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 hover:border-[#D4AF37]/35 transition duration-300 flex flex-col justify-between h-72">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                          <Bed size={18} className="text-[#E6C587]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">غرفة {order.roomNumber}</div>
                          <div className="text-[10px] text-gray-500">طلب #{order.id}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={12} />
                        <span>{new Date(order.orderTime).toLocaleTimeString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users size={12} />
                        <span>{order.guestName}</span>
                      </div>
                    </div>

                    <div className="bg-[#121212] border border-gray-800 rounded-lg p-3 mb-4">
                      <div className="text-[10px] text-gray-500 mb-1">العناصر</div>
                      <div className="text-xs text-white">{order.items.join(', ')}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                    <div className="text-sm font-bold text-[#E6C587]">{order.total.toLocaleString('ar-SA')} ريال</div>
                    <div className="flex gap-2">
                      {order.status === 'ordered' && (
                        <button
                          onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'preparing')}
                          className="px-2.5 py-1 bg-amber-950/40 text-amber-500 border border-amber-500/20 hover:bg-amber-900/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Play size={11} />
                          بدء التجهيز
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'delivered')}
                          className="px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Check size={11} />
                          تم التوصيل
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Stats View */}
      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl flex items-center justify-center">
                <Utensils size={24} className="text-[#E6C587]" />
              </div>
              <span className="text-xs text-gray-500">إجمالي الطلبات</span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats?.totalOrders || 0}</h3>
            <p className="text-xs text-gray-600 mt-2">طلب</p>
          </div>

          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-950/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-yellow-400" />
              </div>
              <span className="text-xs text-gray-500">طلبات معلقة</span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats?.pendingOrders || 0}</h3>
            <p className="text-xs text-gray-600 mt-2">طلب</p>
          </div>

          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-400" />
              </div>
              <span className="text-xs text-gray-500">طلبات مكتملة</span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats?.completedOrders || 0}</h3>
            <p className="text-xs text-gray-600 mt-2">طلب</p>
          </div>

          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-[#E6C587]" />
              </div>
              <span className="text-xs text-gray-500">إجمالي الإيرادات</span>
            </div>
            <h3 className="text-3xl font-black text-[#E6C587]">{stats?.totalRevenue?.toLocaleString('ar-SA') || 0}</h3>
            <p className="text-xs text-gray-600 mt-2">ريال</p>
          </div>

          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6 md:col-span-2 lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-400" />
              </div>
              <span className="text-xs text-gray-500">إيرادات اليوم</span>
            </div>
            <h3 className="text-3xl font-black text-[#E6C587]">{stats?.todayRevenue?.toLocaleString('ar-SA') || 0}</h3>
            <p className="text-xs text-gray-600 mt-2">ريال</p>
          </div>
        </div>
      )}

      {/* Pending Orders View */}
      {viewMode === 'pending' && (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">رقم الطلب</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">اسم الضيف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الغرفة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">العناصر</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المبلغ</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الوقت</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الحالة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order: any) => (
                <tr key={order.orderId} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white">{order.orderId}</td>
                  <td className="py-3 text-sm text-white">{order.guestName}</td>
                  <td className="py-3 text-sm text-white">{order.roomNumber}</td>
                  <td className="py-3 text-sm text-gray-400 max-w-xs truncate">{order.items}</td>
                  <td className="py-3 text-sm text-[#E6C587] font-bold">{order.totalAmount.toLocaleString('ar-SA')} ريال</td>
                  <td className="py-3 text-sm text-gray-400">{order.orderTime}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-yellow-950/20 text-yellow-400 border border-yellow-500/30">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => apiService.updateRoomServiceOrderStatus(order.orderId, 'COMPLETED')}
                        className="p-1.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/30 transition"
                      >
                        <Check size={14} className="text-emerald-400" />
                      </button>
                      <button
                        onClick={() => apiService.updateRoomServiceOrderStatus(order.orderId, 'CANCELLED')}
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

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        onSuccess={() => {
          handleCreateOrderSuccess();
        }}
        roomNumber="101"
      />
    </div>
  );
}
