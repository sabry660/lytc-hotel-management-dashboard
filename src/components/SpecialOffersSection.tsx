import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Tag, Plus, X, Edit, Trash2, Save, Loader2, Sparkles, 
  Search, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { apiService, SpecialOfferResponse } from '../services/api';
import SpecialOffersModal from './SpecialOffersModal';

export default function SpecialOffersSection() {
  const [offers, setOffers] = useState<SpecialOfferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOfferResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getSpecialOffers(0, 50);
      setOffers(response.content || []);
    } catch (error: any) {
      console.error('Failed to load offers:', error);
      if (error.message && error.message.includes('Authentication')) {
        setError('فشل المصادقة. يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setError('فشل الاتصال بالخادم. الرجاء المحاولة مرة أخرى.');
      }
      // Set empty array as fallback
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadOffers();
  };

  const handleEdit = (offer: SpecialOfferResponse) => {
    setEditingOffer(offer);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;
    
    try {
      // Note: Delete API not available in current backend, this is a placeholder
      await new Promise(resolve => setTimeout(resolve, 500));
      setOffers(offers.filter(o => o.id !== id));
    } catch (error) {
      console.error('Failed to delete offer:', error);
    }
  };

  const toggleExpand = (id: number) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587] flex items-center gap-2">
            <Sparkles size={24} className="text-[#D4AF37]" />
            العروض والمزايا
          </h1>
          <p className="text-gray-500 text-xs mt-1">إدارة العروض الخاصة والمزايا للنزلاء</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
        >
          <Plus size={15} />
          <span>عرض جديد</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث في العروض..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none transition"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition">
          <Filter size={14} />
          تصفية
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <X size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل العروض</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadOffers}
            className="px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredOffers.length === 0 ? (
            <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
              <Tag size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 mb-2">لا توجد عروض حالياً</h3>
              <p className="text-xs text-gray-600 mb-4">ابدأ بإضافة عرض جديد للنزلاء</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
              >
                إضافة عرض
              </button>
            </div>
          ) : (
            /* Offers Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0b0b0b] border border-gray-900 rounded-xl overflow-hidden hover:border-[#D4AF37]/35 transition duration-300"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-900">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-1">{offer.title}</h3>
                        <span className="text-[10px] text-gray-500 font-mono">#{offer.id}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="p-1.5 bg-gray-900 hover:bg-red-950/30 text-gray-400 hover:text-red-400 rounded-lg transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isExpanded[offer.id] 
                        ? offer.description 
                        : offer.description.length > 100 
                          ? `${offer.description.substring(0, 100)}...` 
                          : offer.description
                      }
                    </p>
                    
                    {offer.description.length > 100 && (
                      <button
                        onClick={() => toggleExpand(offer.id)}
                        className="mt-2 text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1"
                      >
                        {isExpanded[offer.id] ? (
                          <>
                            <ChevronUp size={10} />
                            عرض أقل
                          </>
                        ) : (
                          <>
                            <ChevronDown size={10} />
                            عرض المزيد
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-[#121212]/50 border-t border-gray-900 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">نشط</span>
                    <button className="text-[10px] text-[#D4AF37] hover:underline">
                      تعديل
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Offer Modal */}
      <SpecialOffersModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
