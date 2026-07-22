import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { colors, isDark } = useThemeColors();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 border rounded-lg transition-all duration-200 ${
        isDark 
          ? 'bg-[#121212] border-gray-800 hover:border-[#D4AF37]/30' 
          : 'bg-white border-gray-200 hover:border-[#D4AF37]/30'
      }`}
      title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-[#D4AF37]" />
      ) : (
        <Moon size={18} className="text-[#D4AF37]" />
      )}
    </button>
  );
}
