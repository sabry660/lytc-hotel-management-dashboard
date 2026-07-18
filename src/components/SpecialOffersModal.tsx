import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Percent, Calendar, Users, Bed, Tag, Save, Loader2 } from 'lucide-react';
import { apiService, CreateSpecialOfferRequest } from '../services/api';

interface SpecialOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SpecialOffersModal({ isOpen, onClose, onSuccess }: SpecialOffersModalProps) {
  const [formData, setFormData] = useState<CreateSpecialOfferRequest>({
    name: '',
    description: '',
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    applicableRoomTypes: [],
    minNights: 1,
    maxGuests: 4,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roomTypes = [
    'classic',
    'premium',
    'deluxe',
    'royal_suite',
    'penthouse'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' || name === 'minNights' || name === 'maxGuests' 
        ? Number(value) 
        : value
    }));
  };

  const handleRoomTypeToggle = (roomType: string) => {
    setFormData(prev => ({
      ...prev,
      applicableRoomTypes: prev.applicableRoomTypes?.includes(roomType)
        ? prev.applicableRoomTypes.filter(type => type !== roomType)
        : [...(prev.applicableRoomTypes || []), roomType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
      setErrorMessage('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      setErrorMessage('نسبة الخصم يجب أن تكون بين 0 و 100');
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
        name: '',
        description: '',
        discountPercentage: 0,
        startDate: '',
        endDate: '',
        applicableRoomTypes: [],
        minNights: 1,
        maxGuests: 4,
      });
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('فشل إنشاء العرض الخاص. الرجاء المحاولة مرة أخرى.');
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Offer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  اسم العرض <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                  rows={3}
                  placeholder="وصف تفصيلي للعرض..."
                  required
                />
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <Percent size={14} />
                  نسبة الخصم <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  placeholder="0"
                  required
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar size={14} />
                    تاريخ البدء <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar size={14} />
                    تاريخ الانتهاء <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Room Types */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <Bed size={14} />
                  أنواع الغرف المطبقة
                </label>
                <div className="flex flex-wrap gap-2">
                  {roomTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleRoomTypeToggle(type)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                        formData.applicableRoomTypes?.includes(type)
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest & Night Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                    <Users size={14} />
                    الحد الأدنى للليالي
                  </label>
                  <input
                    type="number"
                    name="minNights"
                    value={formData.minNights}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                    <Users size={14} />
                    الحد الأقصى للضيوف
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  />
                </div>
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
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
