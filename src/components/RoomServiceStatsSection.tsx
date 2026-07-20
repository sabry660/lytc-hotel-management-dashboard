import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart, XCircle, AlertCircle, DollarSign, Package, Clock, CheckCircle, Loader2
} from 'lucide-react';
import { apiService, DashboardStatsResponse } from '../services/api';

export default function RoomServiceStatsSection() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getRoomServiceStats();
      setStats(response);
    } catch (error: any) {
      console.error('Failed to load room service stats:', error);
      setError('فشل تحميل الإحصائيات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إحصائيات خدمة الغرف</h1>
          <p className="text-gray-500 text-xs mt-1">عرض إحصائيات المبيعات والإيرادات لخدمة الغرف</p>
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
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الإحصائيات</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl flex items-center justify-center">
                <ShoppingCart size={24} className="text-[#E6C587]" />
              </div>
              <span className="text-xs text-gray-500">إجمالي الطلبات</span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
            <p className="text-xs text-gray-600 mt-2">طلب</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-950/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-yellow-400" />
              </div>
              <span className="text-xs text-gray-500">طلبات معلقة</span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.pendingOrders}</h3>
            <p className="text-xs text-gray-600 mt-2">طلب</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <span className="text-xs text-gray-500">طلبات مكتملة</span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.completedOrders}</h3>
            <p className="text-xs text-gray-600 mt-2">طلب</p>
          </div>

          {/* Total Revenue */}
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

          {/* Today Revenue */}
          <div className="bg-[#0b0b0b] border border-gray-900 rounded-2xl p-6 md:col-span-2 lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-purple-400" />
              </div>
              <span className="text-xs text-gray-500">إيرادات اليوم</span>
            </div>
            <h3 className="text-3xl font-black text-[#E6C587]">{stats?.todayRevenue?.toLocaleString('ar-SA') || 0}</h3>
            <p className="text-xs text-gray-600 mt-2">ريال</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد إحصائيات</h3>
          <p className="text-xs text-gray-600 mb-4">لا توجد بيانات إحصائية حالياً</p>
        </div>
      )}
    </div>
  );
}
