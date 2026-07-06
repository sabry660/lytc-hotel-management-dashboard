import React, { useState } from 'react';
import { Settings, Shield, Bell, Hotel, UserCheck, Key, Wifi, Heart } from 'lucide-react';
import { HOTEL_INFO } from '../data';

export default function SettingsSection() {
  const [hotelName, setHotelName] = useState(HOTEL_INFO.name);
  const [hotelPhone, setHotelPhone] = useState(HOTEL_INFO.phone);
  const [hotelEmail, setHotelEmail] = useState(HOTEL_INFO.email);
  const [managerName, setManagerName] = useState(HOTEL_INFO.manager);
  const [notifySound, setNotifySound] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إعدادات النظام الفني والتشغيلي</h1>
          <p className="text-gray-500 text-xs mt-1">تخصيص معلومات الفندق والمنتجع، والتحكم في الخصوصية والصلاحيات وتفضيلات التنبيهات.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Hotel Information Form */}
        <div className="lg:col-span-2 bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#E6C587] flex items-center gap-2 border-b border-gray-850 pb-3">
            <Hotel size={16} className="text-[#D4AF37]" />
            <span>المعلومات التعريفية للفندق والمنتجع</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div className="space-y-1.5">
              <label className="text-gray-400 block">الاسم التجاري للمنشأة:</label>
              <input
                type="text"
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-white focus:outline-none"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 block">المدير العام المسؤول:</label>
              <input
                type="text"
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-white focus:outline-none"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 block">رقم الهاتف الرسمي الساخن:</label>
              <input
                type="text"
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-white focus:outline-none"
                value={hotelPhone}
                onChange={(e) => setHotelPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 block">البريد الإلكتروني المخصص للحجوزات:</label>
              <input
                type="text"
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-white focus:outline-none"
                value={hotelEmail}
                onChange={(e) => setHotelEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                // Save settings to localStorage
                localStorage.setItem('lytc_hotel_name', hotelName);
                localStorage.setItem('lytc_hotel_address', hotelAddress);
                localStorage.setItem('lytc_hotel_email', hotelEmail);
                localStorage.setItem('lytc_notify_sound', JSON.stringify(notifySound));
                localStorage.setItem('lytc_email_summary', JSON.stringify(emailSummary));
                
                // Show success message
                const button = event.target as HTMLButtonElement;
                const originalText = button.textContent;
                button.textContent = 'تم الحفظ بنجاح ✓';
                button.classList.add('bg-emerald-600');
                setTimeout(() => {
                  button.textContent = originalText;
                  button.classList.remove('bg-emerald-600');
                }, 2000);
              }}
              className="px-5 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200"
            >
              حفظ التغييرات التعريفية
            </button>
          </div>
        </div>

        {/* Permissions & Security Settings */}
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-[#E6C587] flex items-center gap-2 border-b border-gray-850 pb-3">
            <Shield size={16} className="text-blue-400" />
            <span>الأمن والأذونات التنبيهية</span>
          </h2>

          {/* Sound & Notifications settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400">تفضيلات الإشعارات التنبيهية:</h3>
            
            <label className="flex items-center justify-between cursor-pointer p-3 bg-[#121212] rounded-xl border border-gray-800/60">
              <div>
                <span className="text-xs font-bold text-white block">صوت التنبيه للطلبات الجديدة</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">تشغيل صوت فاخر عند ورود طلب خدمة من جناح</span>
              </div>
              <input
                type="checkbox"
                checked={notifySound}
                onChange={(e) => setNotifySound(e.target.checked)}
                className="rounded border-gray-800 bg-[#121212] text-[#D4AF37] focus:ring-0 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 bg-[#121212] rounded-xl border border-gray-800/60">
              <div>
                <span className="text-xs font-bold text-white block">ملخص الإيرادات على البريد الإلكتروني</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">إرسال تقرير مالي مشفر يومي للمدير العام</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="rounded border-gray-800 bg-[#121212] text-[#D4AF37] focus:ring-0 h-4 w-4"
              />
            </label>
          </div>

          {/* Connected APIs */}
          <div className="space-y-4 pt-2 border-t border-gray-800">
            <h3 className="text-xs font-bold text-gray-400">الربط الإلكتروني وبوابات الدفع:</h3>
            
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between items-center p-3 bg-[#121212]/50 border border-gray-800 rounded-xl">
                <span>بوابة مدى وفيزا وماستركارد</span>
                <span className="text-emerald-400 text-[10px]">متصل وآمن</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#121212]/50 border border-gray-800 rounded-xl">
                <span>نظام المزامنة والتقاويم (Google Workspace)</span>
                <span className="text-emerald-400 text-[10px]">متصل ومزامن</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
