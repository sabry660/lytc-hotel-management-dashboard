import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag, Search, XCircle, AlertCircle, Building, DollarSign, Loader2, Plus, Utensils, List
} from 'lucide-react';
import { apiService, SpecialOrderResponse } from '../services/api';

export default function SpecialOrdersManagementSection() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [specialOrders, setSpecialOrders] = useState<SpecialOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create special order form state
  const [serviceName, setServiceName] = useState('');
  const [specialOfferId, setSpecialOfferId] = useState<number>(0);
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    loadSpecialOrders();
  }, []);

  const loadSpecialOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getManagerSpecialOrders(0, 50);
      console.log('Special orders response:', response);
      // According to Swagger, this returns PageSpecialOrderResponse
      if (Array.isArray(response)) {
        setSpecialOrders(response);
      } else if (response && typeof response === 'object' && 'content' in response) {
        setSpecialOrders((response as any).content || []);
      } else {
        setSpecialOrders([]);
      }
    } catch (error: any) {
      console.error('Failed to load special orders:', error);
      setError('فشل تحميل الطلبات الخاصة. الرجاء المحاولة مرة أخرى.');
      setSpecialOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSpecialOrder = async () => {
    if (!serviceName || !specialOfferId || !agreedPrice) {
      setCreateError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setIsCreating(true);
    setCreateError('');
    try {
      // Using default stayId=1 since API requires it
      const response = await apiService.createStaySpecialOrder(1, {
        specialOfferId,
        agreedPrice
      });
      console.log('Special order created:', response);
      setSpecialOrders([...specialOrders, response]);
      setViewMode('list');
      // Reset form
      setServiceName('');
      setSpecialOfferId(0);
      setAgreedPrice(0);
    } catch (error: any) {
      console.error('Failed to create special order:', error);
      setCreateError('فشل إنشاء الطلب الخاص. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsCreating(false);
    }
  };

  // Filter special orders based on search
  const filteredSpecialOrders = specialOrders.filter(order => {
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
        <button
          onClick={() => setViewMode('create')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <Plus size={15} />
          <span>إنشاء طلب خاص</span>
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            viewMode === 'list' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          <List size={14} />
          <span>قائمة الطلبات</span>
        </button>
        <button
          onClick={() => setViewMode('create')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            viewMode === 'create' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          <Plus size={14} />
          <span>إنشاء طلب</span>
        </button>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <>
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
                        {order.agreedPrice?.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-emerald-950/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                          نشط
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create View */}
      {viewMode === 'create' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#E6C587] mb-6 flex items-center gap-2">
            <Plus size={20} />
            إنشاء طلب خاص جديد
          </h2>

          {createError && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-xs mb-4">
              {createError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">
                اسم الخدمة <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition"
                placeholder="أدخل اسم الخدمة"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">
                رقم العرض الخاص <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={specialOfferId || ''}
                onChange={(e) => setSpecialOfferId(parseInt(e.target.value))}
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition"
                placeholder="أدخل رقم العرض الخاص"
                min="1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">
                السعر المتفق عليه <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={agreedPrice || ''}
                onChange={(e) => setAgreedPrice(parseFloat(e.target.value))}
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition"
                placeholder="أدخل السعر المتفق عليه"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setViewMode('list')}
                className="flex-1 px-4 py-3 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateSpecialOrder}
                disabled={isCreating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    إنشاء الطلب
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
