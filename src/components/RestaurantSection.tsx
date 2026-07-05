import React from 'react';
import { Coffee, ChevronLeft, Check, Play, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { RestaurantOrder } from '../types';

interface RestaurantSectionProps {
  orders: RestaurantOrder[];
  onUpdateOrderStatus: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function RestaurantSection({ orders, onUpdateOrderStatus }: RestaurantSectionProps) {
  const totalRestaurantSales = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">المطعم الفاخر والمطبخ الملكي</h1>
          <p className="text-gray-500 text-xs mt-1">تتبع طلبات الطعام المباشرة لجميع الطاولات والأجنحة، ومراقبة حالة المطبخ والمبيعات الإجمالية.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Widget */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">مبيعات اليوم الكلية:</span>
          <span className="text-2xl font-black text-[#E6C587] font-mono">
            {totalRestaurantSales.toLocaleString('ar-SA')} <span className="text-xs font-sans">ريال</span>
          </span>
        </div>

        {/* Preparation status */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">طلبات قيد التجهيز بالمطبخ:</span>
          <span className="text-2xl font-black text-amber-500 font-mono">
            {orders.filter(o => o.status === 'preparing').length} طلبات
          </span>
        </div>

        {/* Delivered count */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">الطلبات المسلمة للأجنحة:</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {orders.filter(o => o.status === 'delivered').length} طلبات
          </span>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
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
    </div>
  );
}
