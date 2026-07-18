import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tag, Save, Loader2 } from 'lucide-react';
import { apiService, CreateSpecialOfferRequest } from '../services/api';

interface SpecialOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SpecialOffersModal({ isOpen, onClose, onSuccess }: SpecialOffersModalProps) {
  const [formData, setFormData] = useState<CreateSpecialOfferRequest>({
    title: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      setErrorMessage('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await apiService.createSpecialOffer(formData);
      setIsLoading(false);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
      });
    } catch (error: any) {
      setIsLoading(false);
      if (error.message && error.message.includes('Authentication')) {
        setErrorMessage('فشل المصادقة. يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setErrorMessage('فشل إنشاء العرض الخاص. الرجاء المحاولة مرة أخرى.');
      }
      console.error('Create special offer error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#E6C587] flex items-center gap-2">
                  <Tag size={20} className="text-[#D4AF37]" />
                  إنشاء عرض خاص جديد
                </h2>
                <p className="text-xs text-gray-500 mt-1">أضف عرضاً خاصاً جديداً للنزلاء</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Offer Title */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  عنوان العرض <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  placeholder="مثال: عرض الصيف الفاخر"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  وصف العرض <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition resize-none"
                  rows={4}
                  placeholder="وصف تفصيلي للعرض..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      حفظ العرض
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
