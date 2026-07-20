import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, Search, XCircle, AlertCircle, User, Building, Clock, CheckCircle2, Loader2
} from 'lucide-react';
import { apiService, StayDetailsResponse } from '../services/api';

export default function TodayArrivalsSection() {
  const [arrivals, setArrivals] = useState<StayDetailsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArrivals();
  }, []);

  const loadArrivals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getCheckinTodayStays();
      setArrivals(response.content || []);
    } catch (error: any) {
      if (error.message && error.message.includes('NetworkError')) {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else {
        setError('فشل تحميل البيانات. الرجاء المحاولة مرة أخرى.');
      }
      setArrivals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (stayId: number) => {
    try {
      await apiService.checkInStay(stayId);
      loadArrivals();
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  // Filter arrivals based on search
  const filteredArrivals = arrivals.filter(stay => {
    const matchesSearch = stay.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stay.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">الحجوزات القادمة اليوم</h1>
          <p className="text-gray-500 text-xs mt-1">تحضير الغرف للحجوزات القادمة اليوم</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0b0b0b] border border-gray-900 px-4 py-2 rounded-xl">
          <Calendar size={16} className="text-[#E6C587]" />
          <span className="text-sm text-white font-bold">{new Date().toLocaleDateString('ar-SA')}</span>
        </div>
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
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل الحجوزات القادمة</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadArrivals}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredArrivals.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد حجوزات قادمة اليوم</h3>
          <p className="text-xs text-gray-600 mb-4">لا يوجد حجوزات قادمة لهذا اليوم</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">معرف الحجز</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">اسم الضيف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الغرفة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">وقت الدخول</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">عدد البالغين</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">عدد الأطفال</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredArrivals.map((stay) => (
                <tr key={stay.stayId} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white">{stay.stayId}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-[#E6C587]" />
                      </div>
                      <span className="text-sm text-white font-bold">{stay.guestName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white flex items-center gap-2">
                    <Building size={14} />
                    {stay.roomNumber}
                  </td>
                  <td className="py-3 text-sm text-gray-400 flex items-center gap-2">
                    <Clock size={14} />
                    {stay.checkInTime ? new Date(stay.checkInTime).toLocaleTimeString('ar-SA') : '-'}
                  </td>
                  <td className="py-3 text-sm text-white">{stay.numAdults}</td>
                  <td className="py-3 text-sm text-white">{stay.numKids || 0}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleCheckIn(stay.stayId)}
                      disabled={stay.status === 'CHECKED_IN'}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-900/30 transition disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      تسجيل الدخول
                    </button>
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
