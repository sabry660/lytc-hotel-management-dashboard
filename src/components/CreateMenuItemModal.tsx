import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, ChefHat } from 'lucide-react';
import { apiService, CreateMenuItemRequest } from '../services/api';
import { useThemeColors } from '../hooks/useThemeColors';

interface CreateMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMenuItemModal({ isOpen, onClose, onSuccess }: CreateMenuItemModalProps) {
  const { colors, isDark } = useThemeColors();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('FOOD');
  const [available, setAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !price) {
      setErrorMessage('الرجاء تعبئة الحقول المطلوبة (الاسم والسعر)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const menuItemRequest: CreateMenuItemRequest = {
        name,
        description,
        price,
        category,
        available
      };

      await apiService.createRestaurantMenuItem(menuItemRequest);
      
      setIsLoading(false);
      onSuccess();
      onClose();
      
      // Reset form
      setName('');
      setDescription('');
      setPrice(0);
      setCategory('FOOD');
      setAvailable(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('فشل إنشاء العنصر. الرجاء المحاولة مرة أخرى.');
      console.error('Create menu item error:', error);
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
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{ background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0b0b0b] border-[#D4AF37]/30' : 'bg-white border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${colors.primary.gold}20`, borderColor: `${colors.primary.gold}30`, border: '1px solid' }}>
                  <ChefHat size={20} style={{ color: colors.primary.goldLight }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: colors.primary.goldLight }}>Create Item</h3>
              </div>
              <button onClick={onClose} className={`p-2 border rounded-lg ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'}`}>
                <X size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className={`border text-sm p-3 rounded-lg mb-4 ${isDark ? 'bg-red-950/40 border-red-500/30 text-red-200' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>Price *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-xs block mb-2" style={{ color: colors.text.muted }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${isDark ? 'bg-[#121212] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                >
                  <option value="FOOD">Food</option>
                  <option value="DRINK">Drink</option>
                  <option value="SERVICE">Service</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className={`w-4 h-4 rounded focus:ring-offset-0 ${isDark ? 'bg-[#121212] border-gray-800 focus:ring-[#D4AF37]' : 'bg-white border-gray-300 focus:ring-[#D4AF37]'}`}
                />
                <label htmlFor="available" className="text-xs" style={{ color: colors.text.secondary }}>
                  Available
                </label>
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold transition ${isDark ? 'bg-[#121212] border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-900'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                  style={{ background: colors.primary.goldGradient }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save
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
