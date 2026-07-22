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
import { useThemeColors } from '../hooks/useThemeColors';

interface OrdersSectionProps {
  orders?: RestaurantOrder[];
  onUpdateOrderStatus?: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function OrdersSection({ orders: initialOrders = [], onUpdateOrderStatus }: OrdersSectionProps) {
  const { colors, isDark } = useThemeColors();
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
      case 'ordered': return isDark ? 'text-amber-400 bg-amber-950/20 border-amber-500/30' : 'text-amber-700 bg-amber-50 border-amber-200';
      case 'preparing': return isDark ? 'text-blue-400 bg-blue-950/20 border-blue-500/30' : 'text-blue-700 bg-blue-50 border-blue-200';
      case 'delivered': return isDark ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'completed': return isDark ? 'text-purple-400 bg-purple-950/20 border-purple-500/30' : 'text-purple-700 bg-purple-50 border-purple-200';
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
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5 ${isDark ? 'border-gray-900' : 'border-gray-200'}`}>
        <div>
          <h1 className="text-2xl font-black" style={{ color: colors.primary.goldLight }}>الطلبات</h1>
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>تتبع طلبات الطعام المباشرة لجميع الطاولات والأجنحة، ومراقبة حالة المطبخ والمبيعات الإجمالية.</p>
        </div>
        <div className="flex gap-2">
          {viewMode === 'orders' && (
            <button 
              onClick={() => setIsCreateOrderModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
              style={{ background: colors.primary.goldGradient }}
            >
              <Plus size={15} />
              <span>إنشاء طلب</span>
            </button>
          )}
          {viewMode === 'menu' && (
            <button 
              onClick={() => setIsCreateMenuItemModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
              style={{ background: colors.primary.goldGradient }}
            >
              <Plus size={15} />
              <span>إضافة عنصر</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode Toggles */}
      <div className={`flex flex-wrap items-center gap-2 border p-3 rounded-xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
        {[
          { id: 'orders', label: 'الطلبات', icon: <Utensils size={14} /> },
          { id: 'menu', label: 'القائمة', icon: <ChefHat size={14} /> }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === mode.id ? 'bg-[#D4AF37] text-black' : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:text-gray-900')
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl hover:border-emerald-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>مبيعات اليوم</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{totalRestaurantSales.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-emerald-950/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
            <DollarSign size={16} />
          </div>
        </div>

        <div className={`p-4 border rounded-xl hover:border-blue-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>طلبات قيد التجهيز</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{filteredOrders.filter(o => o.status === 'preparing').length}</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-blue-950/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Timer size={16} />
          </div>
        </div>

        <div className={`p-4 border rounded-xl hover:border-purple-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>الطلبات المسلمة</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{filteredOrders.filter(o => o.status === 'delivered').length}</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-purple-950/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className={`p-4 border rounded-xl hover:border-amber-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>متوسط وقت التجهيز</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{avgPrepTime > 0 ? `${avgPrepTime} دقيقة` : '--'}</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-amber-950/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
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
            <div className={`text-center py-16 border rounded-2xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
              <X size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>فشل تحميل الطلبات</h3>
              <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>{error}</p>
              <button
                onClick={loadOrders}
                className="px-4 py-2 text-black font-extrabold text-xs rounded-xl"
                style={{ background: colors.primary.gold }}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={`text-center py-16 border rounded-2xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
              <Utensils size={48} className="mx-auto mb-4" style={{ color: colors.text.muted }} />
              <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>لا توجد طلبات حالياً</h3>
              <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>ابدأ بإنشاء طلب جديد</p>
              <button
                onClick={() => setIsCreateOrderModalOpen(true)}
                className="px-4 py-2 text-black font-extrabold text-xs rounded-xl"
                style={{ background: colors.primary.gold }}
              >
                إنشاء طلب
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className={`border rounded-xl p-5 hover:border-[#D4AF37]/35 transition duration-300 flex flex-col justify-between h-72 ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-0.5 border text-[10px] font-mono rounded ${isDark ? 'bg-[#121212] border-gray-800 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                          {order.id}
                        </span>
                        <h3 className="text-sm font-bold mt-1.5" style={{ color: colors.text.primary }}>{order.tableNumber}</h3>
                        <span className="text-[10px] font-mono block mt-0.5" style={{ color: colors.text.muted }}>الوقت: {order.time}</span>
                      </div>

                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${getStatusColor(order.status)}`}>
                        {order.status === 'delivered' ? 'تم التوصيل' :
                         order.status === 'preparing' ? 'تحت التجهيز' :
                         'مستلم'}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className={`mt-4 space-y-1 p-3 rounded-lg border h-24 overflow-y-auto ${isDark ? 'bg-[#121212]/50 border-gray-850/60' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="text-[10px] block mb-1" style={{ color: colors.text.muted }}>الوجبات المطلوبة:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs font-semibold flex items-center gap-1.5" style={{ color: colors.text.secondary }}>
                        <span style={{ color: colors.primary.gold }}>🍽️</span>
                        <span>{item.name} x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total and Actions Row */}
                  <div className={`border-t pt-3 flex justify-between items-center text-xs font-semibold ${isDark ? 'border-gray-800/60' : 'border-gray-200'}`}>
                    <div>
                      <span className="text-[10px] block" style={{ color: colors.text.muted }}>إجمالي الفاتورة</span>
                      <span className="text-sm font-black font-mono" style={{ color: colors.primary.goldLight }}>
                        {order.total.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} <span className="text-[10px] font-sans">ريال</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                          order.status === 'PENDING' ? (isDark ? 'bg-amber-950/40 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200') :
                          order.status === 'COMPLETED' ? (isDark ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200') :
                          order.status === 'CANCELLED' ? (isDark ? 'bg-red-950/40 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200') :
                          (isDark ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200')
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
        <div className={`border rounded-xl p-6 ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary.goldLight }}>قائمة الطعام</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat size={48} className="mx-auto mb-4" style={{ color: colors.text.muted }} />
              <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>لا توجد عناصر في القائمة</h3>
              <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>ابدأ بإضافة عنصر جديد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className={`p-4 border rounded-xl ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-sm font-bold" style={{ color: colors.text.primary }}>{item.name}</div>
                  <div className="text-xs mt-1" style={{ color: colors.text.muted }}>{item.description || 'بدون وصف'}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs font-mono" style={{ color: colors.primary.goldLight }}>{item.price} ريال</div>
                    <div className={`text-xs ${item.available ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
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
