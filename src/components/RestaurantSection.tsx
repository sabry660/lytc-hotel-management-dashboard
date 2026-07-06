import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Coffee, ChevronLeft, Check, Play, DollarSign, Clock, CheckCircle2, 
  Utensils, Grid3X3, List, Filter, Search, Plus, X, Save, Download, 
  Printer, TrendingUp, BarChart3, Star, Award, Timer, AlertCircle,
  Package, ChefHat, Table, Calendar, Users
} from 'lucide-react';
import { RestaurantOrder } from '../types';

interface RestaurantSectionProps {
  orders: RestaurantOrder[];
  onUpdateOrderStatus: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function RestaurantSection({ orders, onUpdateOrderStatus }: RestaurantSectionProps) {
  const [viewMode, setViewMode] = useState<'orders' | 'tables' | 'menu' | 'inventory' | 'kitchen'>('orders');
  const [filter, setFilter] = useState<'all' | RestaurantOrder['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);

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
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
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
          { id: 'kitchen', label: 'المطبخ', icon: <Timer size={14} /> }
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
                    <span>{item}</span>
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
                    onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                    className="px-2.5 py-1 bg-amber-950/40 text-amber-500 border border-amber-500/20 hover:bg-amber-900/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Play size={11} />
                    <span>تجهيز</span>
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
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
    </div>
  );
}
