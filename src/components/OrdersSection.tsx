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
import CreateMenuItemModal from './CreateMenuItemModal';
import { apiService } from '../services/api';

interface OrdersSectionProps {
  orders?: RestaurantOrder[];
  onUpdateOrderStatus?: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function OrdersSection({ orders: initialOrders = [], onUpdateOrderStatus }: OrdersSectionProps) {
  const [viewMode, setViewMode] = useState<'orders' | 'menu'>('orders');
  const [filter, setFilter] = useState<'all' | RestaurantOrder['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [isCreateMenuItemModalOpen, setIsCreateMenuItemModalOpen] = useState(false);
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
    } catch (error: any) {
      if (error.message && error.message.includes('500')) {
        setError('خطأ في الخادم عند تحميل الإحصائيات. يرجى التواصل مع فريق الدعم.');
      } else if (error.message && error.message.includes('NetworkError')) {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else {
        setStats(null);
      }
    }
  };

  const loadPendingOrders = async () => {
    try {
      const response = await apiService.getRestaurantPendingOrders();
      setPendingOrders(response || []);
    } catch (error: any) {
      if (error.message && error.message.includes('500')) {
        setError('خطأ في الخادم عند تحميل الطلبات المعلقة. يرجى التواصل مع فريق الدعم.');
      } else if (error.message && error.message.includes('NetworkError')) {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else {
        setPendingOrders([]);
      }
    }
  };

  const loadMenu = async () => {
    try {
      const response = await apiService.getRestaurantMenu(0, 50);
      setMenuItems(response.content || []);
    } catch (error: any) {
      console.error('Failed to load menu:', error);
      // Don't set error state for menu loading to avoid blocking the page
      // Just set empty array
      setMenuItems([]);
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to load orders from backend
      const response = await apiService.getGuestOrders('101', 0, 50);
      console.log('Orders response:', response);
      // Transform backend response to RestaurantOrder format if needed
      const transformedOrders = response.content || [];
      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      if (error.message && error.message.includes('500')) {
        setError('خطأ في الخادم عند تحميل الطلبات. يرجى التواصل مع فريق الدعم.');
      } else if (error.message && error.message.includes('NetworkError')) {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else {
        setOrders([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrderSuccess = () => {
    loadOrders();
  };

  const handleCreateMenuItemSuccess = () => {
    loadMenu();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiService.updateRestaurantOrderStatus(parseInt(orderId), status);
      loadOrders();
      loadPendingOrders();
    } catch (error) {
      alert('فشل تحديث حالة الطلب. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleUpdateMenuItem = async (id: number, itemData: any) => {
    try {
      await apiService.updateRestaurantMenuItem(id, itemData);
      loadMenu();
    } catch (error) {
      alert('فشل تحديث العنصر. الرجاء المحاولة مرة أخرى.');
    }
  };

  const totalRestaurantSales = (orders || []).reduce((sum, order) => sum + order.total, 0);
  const filteredOrders = filter === 'all' ? (orders || []) : (orders || []).filter(o => o.status === filter);

  // Calculate average preparation time
  const preparingOrders = (orders || []).filter(o => o.status === 'preparing' || o.status === 'delivered');
  const avgPrepTime = preparingOrders.length > 0 
    ? Math.round(preparingOrders.reduce((sum, order) => {
        const timeDiff = new Date().getTime() - new Date(order.time).getTime();
        return sum + timeDiff;
      }, 0) / preparingOrders.length / 60000) // Convert to minutes
    : 0;

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
          <h1 className="text-2xl font-black text-[#E6C587]">الطلبات</h1>
          <p className="text-gray-500 text-xs mt-1">تتبع طلبات الطعام المباشرة لجميع الطاولات والأجنحة، ومراقبة حالة المطبخ والمبيعات الإجمالية.</p>
        </div>
        <div className="flex gap-2">
          {viewMode === 'orders' && (
            <button 
              onClick={() => setIsCreateOrderModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
              <Plus size={15} />
              <span>إنشاء طلب</span>
            </button>
          )}
          {viewMode === 'menu' && (
            <button 
              onClick={() => setIsCreateMenuItemModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
              <Plus size={15} />
              <span>إضافة عنصر</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode Toggles */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
        {[
          { id: 'orders', label: 'الطلبات', icon: <Utensils size={14} /> },
          { id: 'menu', label: 'القائمة', icon: <ChefHat size={14} /> }
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
            <div className="text-lg font-bold text-white font-mono">{totalRestaurantSales.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
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
            <div className="text-lg font-bold text-white font-mono">{avgPrepTime > 0 ? `${avgPrepTime} دقيقة` : '--'}</div>
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
                  {order.total.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} <span className="text-[10px] font-sans">ريال</span>
                </span>
              </div>

              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                    order.status === 'PENDING' ? 'bg-amber-950/40 text-amber-500 border-amber-500/20' :
                    order.status === 'COMPLETED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' :
                    order.status === 'CANCELLED' ? 'bg-red-950/40 text-red-400 border-red-500/20' :
                    'bg-blue-950/40 text-blue-400 border-blue-500/20'
                  }`}
                >
                  <option value="PENDING">قيد الانتظار</option>
                  <option value="COMPLETED">مكتمل</option>
                  <option value="CANCELLED">ملغي</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
          )}
        </>
      )}

      {/* Menu View */}
      {viewMode === 'menu' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">قائمة الطعام</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد عناصر في القائمة</h3>
              <p className="text-xs text-gray-600 mb-4">ابدأ بإضافة عنصر جديد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.description || 'بدون وصف'}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-[#E6C587] font-mono">{item.price} ريال</div>
                    <div className={`text-xs ${item.available ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.available ? 'متوفر' : 'غير متوفر'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Create Menu Item Modal */}
      <CreateMenuItemModal
        isOpen={isCreateMenuItemModalOpen}
        onClose={() => setIsCreateMenuItemModalOpen(false)}
        onSuccess={() => {
          handleCreateMenuItemSuccess();
        }}
      />
    </div>
  );
}
