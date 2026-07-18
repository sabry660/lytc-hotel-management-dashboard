import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star, Search, XCircle, AlertCircle, User, Calendar, Building, Loader2
} from 'lucide-react';
import { apiService, StayDetailsResponse } from '../services/api';

export default function RatingsSection() {
  const [ratedStays, setRatedStays] = useState<StayDetailsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRatedStays();
  }, []);

  const loadRatedStays = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getRatedStays();
      setRatedStays(response.content || []);
    } catch (error: any) {
      console.error('Failed to load rated stays:', error);
      setRatedStays([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rated stays based on search
  const filteredRatedStays = (ratedStays || []).filter(stay => {
    const matchesSearch = stay.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stay.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate average rating
  const averageRating = ratedStays.length > 0
    ? (ratedStays.reduce((sum, stay) => sum + (stay.stars || 0), 0) / ratedStays.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">التقييمات</h1>
          <p className="text-gray-500 text-xs mt-1">عرض وتحليل تقييمات الحجوزات</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0b0b0b] border border-gray-900 px-4 py-2 rounded-xl">
          <Star size={16} className="text-[#E6C587]" />
          <span className="text-sm text-white font-bold">متوسط التقييم: {averageRating}</span>
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
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل التقييمات</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRatedStays}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredRatedStays.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد تقييمات</h3>
          <p className="text-xs text-gray-600 mb-4">لا يوجد حالياً حجوزات مقيّمة</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">معرف الحجز</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">اسم الضيف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الغرفة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">تاريخ الدخول</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">تاريخ المغادرة</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">التقييم</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatedStays.map((stay) => (
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
                    <Calendar size={14} />
                    {stay.checkInTime ? new Date(stay.checkInTime).toLocaleDateString('ar-SA') : '-'}
                  </td>
                  <td className="py-3 text-sm text-gray-400 flex items-center gap-2">
                    <Calendar size={14} />
                    {stay.expectedCheckOutDate ? new Date(stay.expectedCheckOutDate).toLocaleDateString('ar-SA') : '-'}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= (stay.stars || 0) ? 'text-[#E6C587] fill-[#E6C587]' : 'text-gray-600'}
                        />
                      ))}
                      <span className="text-sm text-white font-bold mr-2">{stay.stars || 0}/5</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-400 max-w-xs truncate">
                    {stay.notes || '-'}
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
