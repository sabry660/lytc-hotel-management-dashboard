import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, ChefHat } from 'lucide-react';
import { apiService, CreateMenuItemRequest } from '../services/api';

interface CreateMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMenuItemModal({ isOpen, onClose, onSuccess }: CreateMenuItemModalProps) {
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg">
                  <ChefHat size={20} className="text-[#E6C587]" />
                </div>
                <h3 className="text-xl font-bold text-[#E6C587]">Create Item</h3>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-sm p-3 rounded-lg mb-4">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-2">Price *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
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
                  className="w-4 h-4 bg-[#121212] border border-gray-800 rounded focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <label htmlFor="available" className="text-xs text-gray-400">
                  Available
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
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
