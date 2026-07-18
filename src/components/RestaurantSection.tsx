import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Coffee, ChevronLeft, Check, Play, DollarSign, Clock, CheckCircle2, 
  Utensils, Grid3X3, List, Filter, Search, Plus, X, Save, Download, 
  Printer, TrendingUp, BarChart3, Star, Award, Timer, AlertCircle,
  Package, ChefHat, Table, Calendar, Users, Loader2
} from 'lucide-react';
import { RestaurantOrder } from '../types';
import CreateOrderModal from './CreateOrderModal';
import { apiService } from '../services/api';

interface RestaurantSectionProps {
  orders?: RestaurantOrder[];
  onUpdateOrderStatus?: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function RestaurantSection({ orders: initialOrders = [], onUpdateOrderStatus }: RestaurantSectionProps) {
  const [viewMode, setViewMode] = useState<'orders' | 'tables' | 'menu' | 'inventory' | 'kitchen' | 'stats' | 'pending'>('orders');
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
      const response = await apiService.getRestaurantStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats(null);
    }
  };

  const loadPendingOrders = async () => {
    try {
      const response = await apiService.getRestaurantPendingOrders();
      setPendingOrders(response || []);
    } catch (error) {
      console.error('Failed to load pending orders:', error);
      setPendingOrders([]);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await apiService.getRestaurantMenu(0, 50);
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
      // Try to load orders from backend
      const response = await apiService.getGuestOrders('101', 0, 50);
      // Transform backend response to RestaurantOrder format if needed
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
      console.log('Updating restaurant order status:', orderId, status);
      await apiService.updateRestaurantOrderStatus(parseInt(orderId), status);
      loadOrders();
      loadPendingOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('فشل تحديث حالة الطلب. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleUpdateMenuItem = async (id: number, itemData: any) => {
    try {
      console.log('Updating restaurant menu item:', id, itemData);
      await apiService.updateRestaurantMenuItem(id, itemData);
      loadMenu();
    } catch (error) {
      console.error('Failed to update menu item:', error);
      alert('فشل تحديث العنصر. الرجاء المحاولة مرة أخرى.');
    }
  };

  const totalRestaurantSales = orders.reduce((sum, order) => sum + order.total, 0);
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: RestaurantOrder['status']) => {
    switch (status) {
      case 'ordered': return 'text-amber-400 bg-amber-950/20 border-amber-500/30';
      case 'preparing': return 'text-blue-400 bg-blue-950/20 border-blue-500/30';
      case 'delivered': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'completed': return 'text-purple-400 bg-purple-950/20 border-purple-500/30';
    }
  };

  const getStatusLabel = (status: RestaurantOrder['status']) => {
    switch (status) {
      case 'ordered': return 'تم الطلب';
      case 'preparing': return 'جاري التجهيز';
      case 'delivered': return 'تم التوصيل';
      case 'completed': return 'مكتمل';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">المطعم الفاخر والمطبخ الملكي</h1>
          <p className="text-gray-500 text-xs mt-1">تتبع طلبات الطعام المباشرة لجميع الطاولات والأجنحة، ومراقبة حالة المطبخ والمبيعات الإجمالية.</p>
        </div>
        <button 
          onClick={() => setIsCreateOrderModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <Plus size={15} />
          <span>طلب جديد</span>
        </button>
      </div>

      {/* View Mode Toggles */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
        {[
          { id: 'orders', label: 'الطلبات', icon: <Utensils size={14} /> },
          { id: 'tables', label: 'الطاولات', icon: <Table size={14} /> },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">مبيعات اليوم</span>
            <div className="text-lg font-bold text-white font-mono">{totalRestaurantSales.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <DollarSign size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">طلبات قيد التجهيز</span>
            <div className="text-lg font-bold text-white font-mono">{filteredOrders.filter(o => o.status === 'preparing').length}</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
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

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">متوسط وقت التجهيز</span>
            <div className="text-lg font-bold text-white font-mono">18 دقيقة</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Clock size={16} />
          </div>
        </div>
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
              <X size={48} className="text-red-500 mx-auto mb-4" />
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
              <p className="text-xs text-gray-600 mb-4">ابدأ بإنشاء طلب جديد</p>
              <button
                onClick={() => setIsCreateOrderModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
              >
                إنشاء طلب
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 hover:border-[#D4AF37]/35 transition duration-300 flex flex-col justify-between h-72">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-[#121212] border border-gray-800 text-gray-400 text-[10px] font-mono rounded">
                          {order.id}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1.5">{order.tableNumber}</h3>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">الوقت: {order.time}</span>
                      </div>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  order.status === 'delivered' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' :
                  order.status === 'preparing' ? 'bg-amber-950/40 text-amber-500 border-amber-500/20' :
                  'bg-blue-950/40 text-blue-400 border-blue-500/20'
                }`}>
                  {order.status === 'delivered' ? 'تم التوصيل' :
                   order.status === 'preparing' ? 'تحت التجهيز' :
                   'مستلم'}
                </span>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-1 bg-[#121212]/50 p-3 rounded-lg border border-gray-850/60 h-24 overflow-y-auto">
                <span className="text-[10px] text-gray-500 block mb-1">الوجبات المطلوبة:</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">🍽️</span>
                    <span>{item.name} x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Actions Row */}
            <div className="border-t border-gray-800/60 pt-3 flex justify-between items-center text-xs font-semibold">
              <div>
                <span className="text-[10px] text-gray-500 block">إجمالي الفاتورة</span>
                <span className="text-sm font-black font-mono text-[#E6C587]">
                  {order.total.toLocaleString('ar-SA')} <span className="text-[10px] font-sans">ريال</span>
                </span>
              </div>

              <div className="flex gap-2">
                {order.status === 'ordered' && (
                  <button
                    onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'preparing')}
                    className="px-2.5 py-1 bg-amber-950/40 text-amber-500 border border-amber-500/20 hover:bg-amber-900/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Play size={11} />
                    <span>تجهيز</span>
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'delivered')}
                    className="px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Check size={11} />
                    <span>توصيل</span>
                  </button>
                )}

                {order.status === 'delivered' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 size={12} />
                    <span>بألف عافية</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
          )}
        </>
      )}

      {/* Tables View */}
      {viewMode === 'tables' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">إدارة الطاولات</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((table) => (
              <div key={table} className="p-4 bg-[#121212] border border-gray-800 rounded-xl text-center">
                <Table size={24} className="text-[#D4AF37] mx-auto mb-2" />
                <div className="text-sm font-bold text-white">طاولة {table}</div>
                <div className="text-xs text-emerald-400 mt-1">متاحة</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu View */}
      {viewMode === 'menu' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">قائمة الطعام</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['مشاوي ملكية', 'أطباق بحرية فاخرة', 'حلويات شرقية', 'مشروبات باردة', 'قهوة مختصة', 'مقبلات متنوعة'].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div className="text-sm font-bold text-white">{item}</div>
                <div className="text-xs text-gray-500 mt-1">متوفر</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory View */}
      {viewMode === 'inventory' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">إدارة المخزون</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['لحوم طازجة', 'خضروات', 'منتجات ألبان', 'بهارات وتوابل', 'مخبوزات', 'مشروبات'].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-white">{item}</div>
                  <div className="text-xs text-emerald-400">متوفر</div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kitchen View */}
      {viewMode === 'kitchen' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">طابور المطبخ</h3>
          <div className="space-y-3">
            {filteredOrders.filter(o => o.status === 'preparing' || o.status === 'ordered').map((order) => (
              <div key={order.id} className="p-4 bg-[#121212] border border-gray-800 rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">طاولة {order.tableNumber}</div>
                  <div className="text-xs text-gray-500">{order.items.join(', ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  {order.status === 'ordered' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                      className="p-2 bg-blue-950/30 text-blue-400 rounded-lg"
                    >
                      <Play size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
                        onClick={() => apiService.updateRestaurantOrderStatus(order.orderId, 'COMPLETED')}
                        className="p-1.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/30 transition"
                      >
                        <Check size={14} className="text-emerald-400" />
                      </button>
                      <button
                        onClick={() => apiService.updateRestaurantOrderStatus(order.orderId, 'CANCELLED')}
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
          // Refresh orders after successful creation
          handleCreateOrderSuccess();
        }}
        roomNumber="101" // This should come from props or context
      />
    </div>
  );
}
