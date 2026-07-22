import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star, Search, XCircle, AlertCircle, User, Calendar, Building, Loader2
} from 'lucide-react';
import { apiService, StayDetailsResponse } from '../services/api';
import { useThemeColors } from '../hooks/useThemeColors';

export default function RatingsSection() {
  const { colors, isDark } = useThemeColors();
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
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5 ${isDark ? 'border-gray-900' : 'border-gray-200'}`}>
        <div>
          <h1 className="text-2xl font-black" style={{ color: colors.primary.goldLight }}>التقييمات</h1>
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>عرض وتحليل تقييمات الحجوزات</p>
        </div>
        <div className={`flex items-center gap-2 border px-4 py-2 rounded-xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <Star size={16} style={{ color: colors.primary.goldLight }} />
          <span className="text-sm font-bold" style={{ color: colors.text.primary }}>متوسط التقييم: {averageRating}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`flex items-center gap-3 border p-4 rounded-xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: colors.text.muted }} />
          <input
            type="text"
            placeholder="بحث بالاسم أو الغرفة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`rounded-lg px-4 py-2 pr-10 text-xs focus:outline-none w-48 ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : error ? (
        <div className={`text-center py-16 border rounded-2xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>فشل تحميل التقييمات</h3>
          <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>{error}</p>
          <button
            onClick={loadRatedStays}
            className="px-4 py-2 text-black font-extrabold text-xs rounded-xl"
            style={{ background: colors.primary.gold }}
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredRatedStays.length === 0 ? (
        <div className={`text-center py-16 border rounded-2xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: colors.text.muted }} />
          <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.muted }}>لا توجد تقييمات</h3>
          <p className="text-xs mb-4" style={{ color: colors.text.disabled }}>لا يوجد حالياً حجوزات مقيّمة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRatedStays.map((stay) => (
            <motion.div
              key={stay.stayId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-xl overflow-hidden hover:border-[#D4AF37]/35 transition duration-300 ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${isDark ? 'border-gray-900' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${colors.primary.gold}20`, borderColor: `${colors.primary.gold}30`, border: '1px solid' }}>
                      <User size={18} style={{ color: colors.primary.goldLight }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: colors.text.primary }}>{stay.guestName}</h3>
                      <span className="text-[10px] font-mono" style={{ color: colors.text.muted }}>#{stay.stayId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= (stay.stars || 0) ? (isDark ? 'text-[#E6C587] fill-[#E6C587]' : 'text-[#D4AF37] fill-[#D4AF37]') : (isDark ? 'text-gray-600' : 'text-gray-400')}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.secondary }}>
                  <Building size={14} style={{ color: colors.primary.gold }} />
                  <span>الغرفة: {stay.roomNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.secondary }}>
                  <Calendar size={14} style={{ color: colors.primary.gold }} />
                  <span>الدخول: {stay.checkInTime ? new Date(stay.checkInTime).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.secondary }}>
                  <Calendar size={14} style={{ color: colors.primary.gold }} />
                  <span>المغادرة: {stay.expectedCheckOutDate ? new Date(stay.expectedCheckOutDate).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-'}</span>
                </div>
                {stay.notes && (
                  <div className={`pt-2 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>{stay.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`px-4 py-3 border-t ${isDark ? 'bg-[#121212]/50 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: colors.text.muted }}>التقييم</span>
                  <span className="text-sm font-bold" style={{ color: colors.primary.goldLight }}>{stay.stars || 0}/5</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
