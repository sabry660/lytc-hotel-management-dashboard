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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRatedStays.map((stay) => (
            <motion.div
              key={stay.stayId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0b0b0b] border border-gray-900 rounded-xl overflow-hidden hover:border-[#D4AF37]/35 transition duration-300"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-900">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                      <User size={18} className="text-[#E6C587]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{stay.guestName}</h3>
                      <span className="text-[10px] text-gray-500 font-mono">#{stay.stayId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= (stay.stars || 0) ? 'text-[#E6C587] fill-[#E6C587]' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Building size={14} className="text-[#D4AF37]" />
                  <span>الغرفة: {stay.roomNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} className="text-[#D4AF37]" />
                  <span>الدخول: {stay.checkInTime ? new Date(stay.checkInTime).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} className="text-[#D4AF37]" />
                  <span>المغادرة: {stay.expectedCheckOutDate ? new Date(stay.expectedCheckOutDate).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-'}</span>
                </div>
                {stay.notes && (
                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-xs text-gray-300 leading-relaxed">{stay.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-[#121212]/50 border-t border-gray-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">التقييم</span>
                  <span className="text-sm font-bold text-[#E6C587]">{stay.stars || 0}/5</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
