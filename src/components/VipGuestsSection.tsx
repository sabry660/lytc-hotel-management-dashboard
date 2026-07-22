import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown, Search, XCircle, AlertCircle, Phone, Globe, FileText, Loader2, Plus, X, Save
} from 'lucide-react';
import { apiService, VipResponse, CreateVipRequest } from '../services/api';

export default function VipGuestsSection() {
  const [vips, setVips] = useState<VipResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newVip, setNewVip] = useState({
    fullName: '',
    phone: '',
    nationality: '',
    notes: ''
  });

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

  const handleCreateVip = async () => {
    if (!newVip.fullName) {
      setCreateError('يرجى إدخال الاسم الكامل');
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    try {
      await apiService.createVip(newVip);
      setNewVip({ fullName: '', phone: '', nationality: '', notes: '' });
      setIsCreateModalOpen(false);
      loadVips();
    } catch (error: any) {
      console.error('Failed to create VIP:', error);
      setCreateError('فشل إنشاء VIP. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsCreating(false);
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
        >
          <Plus size={16} />
          <span>إضافة VIP</span>
        </button>
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

      {/* Create VIP Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full relative space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              
              <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#E6C587]">إضافة VIP جديد</h3>
                  <p className="text-sm text-gray-500 mt-1">أدخل بيانات النزيل المميز</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {createError && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-xs text-red-400">
                  {createError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={newVip.fullName}
                    onChange={(e) => setNewVip({ ...newVip, fullName: e.target.value })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={newVip.phone}
                    onChange={(e) => setNewVip({ ...newVip, phone: e.target.value })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">الجنسية</label>
                  <input
                    type="text"
                    value={newVip.nationality}
                    onChange={(e) => setNewVip({ ...newVip, nationality: e.target.value })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                    placeholder="أدخل الجنسية"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">ملاحظات</label>
                  <textarea
                    value={newVip.notes}
                    onChange={(e) => setNewVip({ ...newVip, notes: e.target.value })}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 text-xs text-white focus:outline-none resize-none"
                    placeholder="أدخل أي ملاحظات"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={handleCreateVip}
                  disabled={isCreating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{isCreating ? 'جاري الإنشاء...' : 'حفظ'}</span>
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 font-bold text-xs rounded-xl hover:text-white disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
