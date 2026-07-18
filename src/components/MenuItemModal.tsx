import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Utensils, DollarSign, Clock, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { apiService, CreateMenuItemRequest } from '../services/api';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  menuType: 'room-service' | 'restaurant' | 'cafe';
}

export default function MenuItemModal({ isOpen, onClose, onSuccess, menuType }: MenuItemModalProps) {
  const [formData, setFormData] = useState<CreateMenuItemRequest>({
    name: '',
    description: '',
    price: 0,
    category: 'main_course',
    available: true,
    preparationTime: 15,
    imageUrl: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { value: 'appetizer', label: 'مقبلات' },
    { value: 'main_course', label: 'أطباق رئيسية' },
    { value: 'dessert', label: 'حلويات' },
    { value: 'beverage', label: 'مشروبات' },
    { value: 'special', label: 'أطباق خاصة' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'price' || name === 'preparationTime'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      setErrorMessage('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      let response;
      switch (menuType) {
        case 'room-service':
          response = await apiService.createRoomServiceMenuItem(formData);
          break;
        case 'restaurant':
          response = await apiService.createRestaurantMenuItem(formData);
          break;
        case 'cafe':
          response = await apiService.createCafeMenuItem(formData);
          break;
      }

      setIsLoading(false);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'main_course',
        available: true,
        preparationTime: 15,
        imageUrl: '',
      });
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('فشل إنشاء عنصر القائمة. الرجاء المحاولة مرة أخرى.');
      console.error('Create menu item error:', error);
    }
  };

  const getMenuTypeLabel = () => {
    switch (menuType) {
      case 'room-service':
        return 'خدمة الغرف';
      case 'restaurant':
        return 'المطعم';
      case 'cafe':
        return 'المقهى';
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
                  <Utensils size={20} className="text-[#D4AF37]" />
                  إضافة عنصر قائمة جديد
                </h2>
                <p className="text-xs text-gray-500 mt-1">{getMenuTypeLabel()}</p>
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

              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  اسم العنصر <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  placeholder="مثال: كبدة لحم فاخرة"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  الوصف <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition resize-none"
                  rows={3}
                  placeholder="وصف تفصيلي للعنصر..."
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <DollarSign size={14} />
                  السعر (ريال) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  الفئة <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preparation Time */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <Clock size={14} />
                  وقت التحضير (دقائق)
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  placeholder="15"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                  <ImageIcon size={14} />
                  رابط الصورة
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none transition"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Available Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-white block">متاح للطلب</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">إظهار العنصر في القائمة</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
                </label>
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
                      حفظ العنصر
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
