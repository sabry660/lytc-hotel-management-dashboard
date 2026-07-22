import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Loader2, Utensils, Coffee, Sparkles, Search } from 'lucide-react';
import { apiService, CreateOrderRequest, OrderItemRequest } from '../services/api';
import { useThemeColors } from '../hooks/useThemeColors';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roomNumber: string;
}

interface OrderItem {
  menuItemId: number;
  quantity: number;
  notes?: string;
  name?: string;
  price?: number;
}

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  available?: boolean;
}

export default function CreateOrderModal({ isOpen, onClose, onSuccess, roomNumber }: CreateOrderModalProps) {
  const { colors, isDark } = useThemeColors();
  const [category, setCategory] = useState<'FOOD' | 'DRINK' | 'SERVICE'>('FOOD');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'FOOD', label: 'طعام', icon: Utensils },
    { value: 'DRINK', label: 'مشروبات', icon: Coffee },
    { value: 'SERVICE', label: 'خدمات', icon: Sparkles },
  ];

  useEffect(() => {
    if (isOpen) {
      loadMenuItems();
    }
  }, [isOpen, category]);

  const loadMenuItems = async () => {
    setIsLoadingMenu(true);
    try {
      // Load all menu items without category filter first
      const response = await apiService.getGuestMenu(undefined, 0, 100);
      console.log('Menu items response:', response);
      console.log('Category filter:', category);
      
      // Filter items by category on the client side if needed
      let items = response.content || [];
      if (category && category !== 'ALL') {
        items = items.filter((item: MenuItem) => item.category === category);
      }
      
      console.log('Filtered menu items:', items);
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      setMenuItems([]);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const addItem = () => {
    setItems([...items, { menuItemId: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems((items || []).filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // When selecting a menu item, also set name and price
    if (field === 'menuItemId') {
      const selectedItem = menuItems.find(item => item.id === value);
      if (selectedItem) {
        newItems[index].name = selectedItem.name;
        newItems[index].price = selectedItem.price;
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setErrorMessage('الرجاء إضافة عنصر واحد على الأقل');
      return;
    }

    const validItems = items.filter(item => item.menuItemId > 0 && item.quantity > 0);
    if (validItems.length === 0) {
      setErrorMessage('الرجاء التأكد من جميع العناصر (معرف العنصر والكمية)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const orderRequest: CreateOrderRequest = {
        category: category,
        items: validItems.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes
        }))
      };

      await apiService.createGuestOrder(roomNumber, orderRequest);
      
      setIsLoading(false);
      onSuccess();
      onClose();
      
      // Reset form
      setCategory('FOOD');
      setItems([]);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('فشل إنشاء الطلب. الرجاء المحاولة مرة أخرى.');
      console.error('Create order error:', error);
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
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative ${isDark ? 'bg-[#0b0b0b] border-[#D4AF37]/30' : 'bg-white border-gray-200'}`}
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.primary.goldLight }}>
                  <Utensils size={20} style={{ color: colors.primary.gold }} />
                  إنشاء طلب جديد
                </h2>
                <p className="text-xs mt-1" style={{ color: colors.text.muted }}>رقم الغرفة: {roomNumber}</p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 border rounded-lg transition ${isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {errorMessage && (
                <div className={`p-3 border rounded-lg text-xs ${isDark ? 'bg-red-950/20 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {errorMessage}
                </div>
              )}

              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: colors.text.muted }}>
                  فئة الطلب <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition ${
                          category === cat.value
                            ? 'bg-[#D4AF37] text-black'
                            : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:text-gray-900')
                        }`}
                      >
                        <Icon size={16} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold" style={{ color: colors.text.muted }}>
                    عناصر الطلب <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs hover:underline flex items-center gap-1"
                    style={{ color: colors.primary.gold }}
                  >
                    <Plus size={14} />
                    إضافة عنصر
                  </button>
                </div>
                
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className={`border rounded-xl p-4 space-y-3 ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          {/* Menu Item Selector */}
                          <div>
                            <label className="block text-[10px] mb-1" style={{ color: colors.text.muted }}>اختر العنصر</label>
                            {isLoadingMenu ? (
                              <div className="flex items-center justify-center py-2">
                                <Loader2 size={16} className="text-[#D4AF37] animate-spin" />
                              </div>
                            ) : (
                              <select
                                value={item.menuItemId}
                                onChange={(e) => updateItem(index, 'menuItemId', parseInt(e.target.value))}
                                className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition ${isDark ? 'bg-[#0b0b0b] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                              >
                                <option value={0}>-- اختر عنصر --</option>
                                {menuItems
                                  .filter(menuItem => 
                                    searchQuery === '' || 
                                    menuItem.name.toLowerCase().includes(searchQuery.toLowerCase())
                                  )
                                  .map((menuItem) => (
                                    <option key={menuItem.id} value={menuItem.id}>
                                      {menuItem.name} - {menuItem.price} ريال
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                          
                          {/* Quantity */}
                          <div>
                            <label className="block text-[10px] mb-1" style={{ color: colors.text.muted }}>الكمية</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition ${isDark ? 'bg-[#0b0b0b] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                              placeholder="الكمية"
                              min="1"
                            />
                          </div>
                          
                          {/* Notes */}
                          <div>
                            <label className="block text-[10px] mb-1" style={{ color: colors.text.muted }}>ملاحظات</label>
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => updateItem(index, 'notes', e.target.value)}
                              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition ${isDark ? 'bg-[#0b0b0b] border-gray-800 focus:border-[#D4AF37] text-white' : 'bg-white border-gray-300 focus:border-[#D4AF37] text-gray-900'}`}
                              placeholder="ملاحظات (اختياري)"
                            />
                          </div>
                          
                          {/* Selected Item Info */}
                          {item.name && (
                            <div className={`p-2 border rounded-lg ${isDark ? 'bg-[#0b0b0b] border-[#D4AF37]/20' : 'bg-gray-100 border-gray-200'}`}>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold" style={{ color: colors.text.primary }}>{item.name}</span>
                                <span className="text-xs font-mono" style={{ color: colors.primary.gold }}>{item.price} ريال</span>
                              </div>
                              <div className="text-[10px] mt-1" style={{ color: colors.text.muted }}>
                                الإجمالي: {(item.price || 0) * item.quantity} ريال
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className={`p-2 rounded-lg transition ${isDark ? 'text-red-400 hover:bg-red-950/20' : 'text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {items.length === 0 && (
                    <div className="text-center py-8 text-xs" style={{ color: colors.text.muted }}>
                      لا توجد عناصر مضافة. اضغط على "إضافة عنصر" للبدء.
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold transition ${isDark ? 'bg-[#121212] border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-900'}`}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || items.length === 0}
                  className="px-6 py-2 text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                  style={{ background: colors.primary.goldGradient }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      جاري إنشاء الطلب...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      إنشاء الطلب
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
