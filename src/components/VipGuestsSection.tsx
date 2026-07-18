import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Crown, Search, XCircle, AlertCircle, Phone, Globe, FileText, Loader2
} from 'lucide-react';
import { apiService, VipResponse } from '../services/api';

export default function VipGuestsSection() {
  const [vips, setVips] = useState<VipResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVips();
  }, []);

  const loadVips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getVips(0, 50);
      setVips(response.content || []);
    } catch (error: any) {
      console.error('Failed to load vips:', error);
      setVips([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter vips based on search
  const filteredVips = (vips || []).filter(vip => {
    const matchesSearch = vip.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vip.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vip.nationality?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">النزلاء VIP</h1>
          <p className="text-gray-500 text-xs mt-1">عرض وإدارة النزلاء المميزين في الفندق</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف أو الجنسية..."
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
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل النزلاء VIP</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadVips}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredVips.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا يوجد نزلاء VIP</h3>
          <p className="text-xs text-gray-600 mb-4">لا يوجد حالياً نزلاء مميزين في النظام</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المعرف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الاسم الكامل</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الهاتف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الجنسية</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {filteredVips.map((vip) => (
                <tr key={vip.id} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white">{vip.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                        <Crown size={14} className="text-[#E6C587]" />
                      </div>
                      <span className="text-sm text-white font-bold">{vip.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-400 flex items-center gap-2">
                    <Phone size={14} />
                    {vip.phone}
                  </td>
                  <td className="py-3 text-sm text-white flex items-center gap-2">
                    <Globe size={14} />
                    {vip.nationality}
                  </td>
                  <td className="py-3 text-sm text-gray-400 flex items-center gap-2">
                    <FileText size={14} />
                    {vip.notes || '-'}
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
