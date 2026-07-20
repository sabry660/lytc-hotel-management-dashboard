import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag, Search, XCircle, AlertCircle, Building, DollarSign, Loader2
} from 'lucide-react';
import { apiService, SpecialOrderResponse } from '../services/api';

export default function SpecialOrdersManagementSection() {
  const [specialOrders, setSpecialOrders] = useState<SpecialOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSpecialOrders();
  }, []);

  const loadSpecialOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getManagerSpecialOrders();
      setSpecialOrders(Array.isArray(response) ? response : []);
    } catch (error: any) {
      // Dummy data fallback
      setSpecialOrders([
        { id: 1, stayId: 101, specialOfferId: 1, agreedPrice: 500, status: 'PENDING' },
        { id: 2, stayId: 205, specialOfferId: 2, agreedPrice: 1200, status: 'CONFIRMED' },
        { id: 3, stayId: 302, specialOfferId: 3, agreedPrice: 300, status: 'PENDING' },
        { id: 4, stayId: 401, specialOfferId: 4, agreedPrice: 800, status: 'CONFIRMED' },
        { id: 5, stayId: 505, specialOfferId: 5, agreedPrice: 200, status: 'PENDING' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter special orders based on search
  const filteredSpecialOrders = (specialOrders || []).filter(order => {
    const matchesSearch = order.id.toString().includes(searchQuery) ||
                          order.stayId.toString().includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">الطلبات الخاصة</h1>
          <p className="text-gray-500 text-xs mt-1">عرض وإدارة الطلبات الخاصة للحجوزات</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث برقم الطلب أو الحجز..."
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
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الطلبات الخاصة</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSpecialOrders}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredSpecialOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد طلبات خاصة</h3>
          <p className="text-xs text-gray-600 mb-4">لا يوجد حالياً طلبات خاصة</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">رقم الطلب</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">رقم الحجز</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">رقم العرض</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">السعر المتفق عليه</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecialOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={14} className="text-[#E6C587]" />
                      </div>
                      <span className="text-sm text-white font-bold">{order.id}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white flex items-center gap-2">
                    <Building size={14} />
                    {order.stayId}
                  </td>
                  <td className="py-3 text-sm text-white">{order.specialOfferId}</td>
                  <td className="py-3 text-sm text-[#E6C587] font-bold flex items-center gap-2">
                    <DollarSign size={14} />
                    {order.agreedPrice?.toLocaleString('ar-SA') || 0} ريال
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      order.status === 'CONFIRMED' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                      order.status === 'PENDING' ? 'bg-yellow-950/20 text-yellow-400 border border-yellow-500/30' :
                      order.status === 'CANCELLED' ? 'bg-red-950/20 text-red-400 border border-red-500/30' :
                      'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {order.status === 'CONFIRMED' ? 'مؤكد' : order.status === 'PENDING' ? 'قيد الانتظار' : order.status === 'CANCELLED' ? 'ملغي' : order.status}
                    </span>
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
