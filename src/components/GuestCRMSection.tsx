import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Plus, Mail, Phone, MapPin, Calendar, Star, 
  CreditCard, Award, MessageSquare, Clock, TrendingUp, Heart, 
  Shield, ChevronLeft, ChevronRight, X, Edit, Download, 
  FileText, Users, Globe, Cake, Gift, AlertCircle, CheckCircle,
  PhoneCall, Mail as MailIcon, MessageCircle, Target, Briefcase,
  Baby, Crown, Diamond, Gem, Sparkles, Building, Plane, Car,
  Utensils, Coffee, Wine, Dumbbell, Wifi, Tv, Snowflake,
  Fan, Wind, Sun, Moon, Cloud, Umbrella, Zap, Volume2,
  Accessibility, Stethoscope, Pill, Syringe,
  HeartPulse, Activity, Brain, Eye, Ear, Hand, Bone
} from 'lucide-react';
import { Guest } from '../types';

interface GuestCRMSectionProps {
  guests: Guest[];
}

export default function GuestCRMSection({ guests }: GuestCRMSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vip' | 'regular'>('all');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 12;

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'vip' && guest.isVIP) ||
                         (filterStatus === 'regular' && !guest.isVIP);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * guestsPerPage,
    currentPage * guestsPerPage
  );

  const getVIPBadge = (guest: Guest) => {
    if (guest.loyaltyPoints && guest.loyaltyPoints > 10000) {
      return { icon: Diamond, color: 'text-purple-400', bg: 'bg-purple-950/20', border: 'border-purple-500/30', label: 'الماسي' };
    } else if (guest.loyaltyPoints && guest.loyaltyPoints > 5000) {
      return { icon: Gem, color: 'text-blue-400', bg: 'bg-blue-950/20', border: 'border-blue-500/30', label: 'الذهبي' };
    } else if (guest.isVIP) {
      return { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-950/20', border: 'border-amber-500/30', label: 'VIP' };
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إدارة علاقات الضيوف (CRM)</h1>
          <p className="text-gray-500 text-xs mt-1">إدارة شاملة لملفات الضيوف، التفضيلات، التاريخ، والولاء.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 text-sm">
            <Plus size={16} />
            <span>ضيف جديد</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-700 transition-all duration-300 text-sm">
            <Download size={16} />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث بالاسم، البريد الإلكتروني، أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterStatus === 'all' 
                ? 'bg-[#D4AF37] text-black' 
                : 'bg-[#121212] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterStatus('vip')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterStatus === 'vip' 
                ? 'bg-[#D4AF37] text-black' 
                : 'bg-[#121212] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            VIP
          </button>
          <button
            onClick={() => setFilterStatus('regular')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterStatus === 'regular' 
                ? 'bg-[#D4AF37] text-black' 
                : 'bg-[#121212] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            عادي
          </button>
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedGuests.map((guest) => {
          const vipBadge = getVIPBadge(guest);
          const VIPBadgeIcon = vipBadge?.icon;
          return (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedGuest(guest)}
            >
              {/* VIP Badge */}
              {vipBadge && (
                <div className={`absolute top-3 left-3 px-2 py-1 ${vipBadge.bg} ${vipBadge.border} rounded-lg flex items-center gap-1`}>
                  <VIPBadgeIcon size={12} className={vipBadge.color} />
                  <span className={`text-[10px] font-bold ${vipBadge.color}`}>{vipBadge.label}</span>
                </div>
              )}

              {/* Guest Avatar */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#AA7B30]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                  {guest.avatarUrl ? (
                    <img src={guest.avatarUrl} alt={guest.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Users size={24} className="text-[#E6C587]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{guest.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{guest.nationality}</p>
                </div>
              </div>

              {/* Guest Info */}
              <div className="px-4 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail size={12} />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone size={12} />
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{guest.stayCount} إقامة</span>
                  </div>
                  {guest.loyaltyPoints && (
                    <div className="flex items-center gap-1 text-xs text-[#E6C587]">
                      <Award size={12} />
                      <span>{guest.loyaltyPoints.toLocaleString('ar-SA')} نقطة</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          عرض {((currentPage - 1) * guestsPerPage) + 1} - {Math.min(currentPage * guestsPerPage, filteredGuests.length)} من {filteredGuests.length} ضيف
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-[#121212] border border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#D4AF37]/30 transition-all"
          >
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                currentPage === page
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#121212] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-[#121212] border border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#D4AF37]/30 transition-all"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Guest Details Modal */}
      <AnimatePresence>
        {selectedGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGuest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#AA7B30]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                    {selectedGuest.avatarUrl ? (
                      <img src={selectedGuest.avatarUrl} alt={selectedGuest.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Users size={32} className="text-[#E6C587]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-[#E6C587]">{selectedGuest.name}</h3>
                      {getVIPBadge(selectedGuest) && (
                        <span className={`px-2 py-1 ${getVIPBadge(selectedGuest)!.bg} ${getVIPBadge(selectedGuest)!.border} rounded-lg flex items-center gap-1`}>
                          {React.createElement(getVIPBadge(selectedGuest)!.icon, { size: 12, className: getVIPBadge(selectedGuest)!.color })}
                          <span className={`text-[10px] font-bold ${getVIPBadge(selectedGuest)!.color}`}>{getVIPBadge(selectedGuest)!.label}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{selectedGuest.nationality}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{selectedGuest.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <span>{selectedGuest.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="p-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Guest Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
                    <FileText size={14} />
                    <span>المعلومات الشخصية</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500 block">الجنسية</span>
                      <span className="text-sm text-white font-bold">{selectedGuest.nationality}</span>
                    </div>
                    {selectedGuest.language && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">اللغة</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.language}</span>
                      </div>
                    )}
                    {selectedGuest.passportNumber && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">رقم الجواز</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.passportNumber}</span>
                      </div>
                    )}
                    {selectedGuest.dateOfBirth && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">تاريخ الميلاد</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.dateOfBirth}</span>
                      </div>
                    )}
                    {selectedGuest.anniversaryDate && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">تاريخ المناسبة السنوية</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.anniversaryDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stay History & Spending */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
                    <Calendar size={14} />
                    <span>تاريخ الإقامة والإنفاق</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                      <span className="text-xs text-gray-500 block">عدد الإقامات</span>
                      <span className="text-sm text-white font-bold">{selectedGuest.stayCount} إقامة</span>
                    </div>
                    {selectedGuest.totalSpending && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">إجمالي الإنفاق</span>
                        <span className="text-sm text-[#E6C587] font-bold">{selectedGuest.totalSpending.toLocaleString('ar-SA')} ريال</span>
                      </div>
                    )}
                    {selectedGuest.loyaltyPoints && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">نقاط الولاء</span>
                        <span className="text-sm text-[#E6C587] font-bold">{selectedGuest.loyaltyPoints.toLocaleString('ar-SA')} نقطة</span>
                      </div>
                    )}
                    {selectedGuest.lifetimeValue && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">القيمة الدائمة</span>
                        <span className="text-sm text-[#E6C587] font-bold">{selectedGuest.lifetimeValue.toLocaleString('ar-SA')} ريال</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
                    <Heart size={14} />
                    <span>التفضيلات</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedGuest.preferredRoom && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">الغرفة المفضلة</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.preferredRoom}</span>
                      </div>
                    )}
                    {selectedGuest.pillowPreference && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">تفضيلات الوسائد</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.pillowPreference}</span>
                      </div>
                    )}
                    {selectedGuest.visitReason && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">سبب الزيارة</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.visitReason}</span>
                      </div>
                    )}
                    {selectedGuest.childrenCount !== undefined && (
                      <div className="p-3 bg-[#121212] border border-gray-800 rounded-xl">
                        <span className="text-xs text-gray-500 block">عدد الأطفال</span>
                        <span className="text-sm text-white font-bold">{selectedGuest.childrenCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Food Preferences */}
              {selectedGuest.favoriteFoods && selectedGuest.favoriteFoods.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2 mb-3">
                    <Utensils size={14} />
                    <span>التفضيلات الغذائية</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuest.favoriteFoods.map((food, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-lg text-xs text-gray-300">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Allergies */}
              {selectedGuest.foodAllergies && selectedGuest.foodAllergies.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
                    <AlertCircle size={14} />
                    <span>الحساسية الغذائية</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuest.foodAllergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-400">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Preferences */}
              {selectedGuest.roomPreferences && selectedGuest.roomPreferences.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2 mb-3">
                    <Building size={14} />
                    <span>تفضيلات الغرفة</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuest.roomPreferences.map((pref, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-lg text-xs text-gray-300">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedGuest.notes && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2 mb-3">
                    <FileText size={14} />
                    <span>الملاحظات</span>
                  </h4>
                  <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                    <p className="text-sm text-gray-300">{selectedGuest.notes}</p>
                  </div>
                </div>
              )}

              {/* Previous Stays */}
              {selectedGuest.previousStays && selectedGuest.previousStays.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-[#E6C587] flex items-center gap-2 mb-3">
                    <Calendar size={14} />
                    <span>الإقامات السابقة</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedGuest.previousStays.map((stay, idx) => (
                      <div key={idx} className="p-3 bg-[#121212] border border-gray-800 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500">غرفة {stay.roomNumber}</span>
                          <div className="text-xs text-white">{stay.checkIn} - {stay.checkOut}</div>
                        </div>
                        <span className="text-sm text-[#E6C587] font-bold">{stay.amount.toLocaleString('ar-SA')} ريال</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3 pt-4 border-t border-gray-800">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                  <Edit size={16} />
                  <span>تعديل الملف</span>
                </button>
                <button className="flex-1 px-6 py-3 bg-[#121212] border border-gray-800 text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-700 transition-all duration-300">
                  <MessageSquare size={16} className="inline ml-2" />
                  <span>إرسال رسالة</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
