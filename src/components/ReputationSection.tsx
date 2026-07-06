import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, MessageSquare, TrendingUp, BarChart3, Filter, Search, Plus, X, Save, Download, Printer,
  CheckCircle2, AlertCircle, Award, Calendar, Users, Globe, MapPin, ExternalLink, Reply, Flag
} from 'lucide-react';

interface Review {
  id: string;
  platform: 'google' | 'booking' | 'tripadvisor' | 'expedia';
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'new' | 'responded' | 'flagged';
}

interface ReputationSectionProps {
  // Props can be added later for data integration
}

export default function ReputationSection({ }: ReputationSectionProps) {
  const [filter, setFilter] = useState<'all' | 'google' | 'booking' | 'tripadvisor' | 'expedia'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'responded' | 'flagged'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo data for reviews
  const reviews: Review[] = [
    { id: '1', platform: 'google', guestName: 'الشيخ محمد', rating: 5, comment: 'تجربة استثنائية! الخدمة كانت على أعلى مستوى والغرف فاخرة جداً', date: 'منذ يوم', status: 'new' },
    { id: '2', platform: 'booking', guestName: 'السيدة نورة', rating: 4, comment: 'إقامة رائعة، الفندق نظيف ومريح، لكن يمكن تحسين خدمة الغرف', date: 'منذ يومين', status: 'responded' },
    { id: '3', platform: 'tripadvisor', guestName: 'الأستاذ أحمد', rating: 5, comment: 'أفضل فندق أقمت فيه في الرياض. الموقع ممتاز والمرافق رائعة', date: 'منذ 3 أيام', status: 'responded' },
    { id: '4', platform: 'expedia', guestName: 'السيدة سارة', rating: 3, comment: 'الغرفة جيدة لكن الأسعار مرتفعة قليلاً مقارنة بالخدمة المقدمة', date: 'منذ أسبوع', status: 'flagged' },
    { id: '5', platform: 'google', guestName: 'السيد خالد', rating: 5, comment: 'تجربة لا تُنسى! سأعود بالتأكيد', date: 'منذ أسبوعين', status: 'responded' },
    { id: '6', platform: 'booking', guestName: 'السيدة هند', rating: 4, comment: 'فندق راقي جداً، الموظفون محترفون ومتعاونون', date: 'منذ 3 أسابيع', status: 'responded' },
  ];

  const filteredReviews = reviews.filter(review => {
    const platformMatch = filter === 'all' || review.platform === filter;
    const statusMatch = statusFilter === 'all' || review.status === statusFilter;
    const searchMatch = review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return platformMatch && statusMatch && searchMatch;
  });

  const getPlatformColor = (platform: Review['platform']) => {
    switch (platform) {
      case 'google': return 'text-blue-400 bg-blue-950/20 border-blue-500/30';
      case 'booking': return 'text-blue-600 bg-blue-950/20 border-blue-600/30';
      case 'tripadvisor': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'expedia': return 'text-yellow-400 bg-yellow-950/20 border-yellow-500/30';
    }
  };

  const getPlatformLabel = (platform: Review['platform']) => {
    switch (platform) {
      case 'google': return 'Google';
      case 'booking': return 'Booking.com';
      case 'tripadvisor': return 'TripAdvisor';
      case 'expedia': return 'Expedia';
    }
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'new': return 'text-amber-400 bg-amber-950/20 border-amber-500/30';
      case 'responded': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'flagged': return 'text-red-400 bg-red-950/20 border-red-500/30';
    }
  };

  const getStatusLabel = (status: Review['status']) => {
    switch (status) {
      case 'new': return 'جديد';
      case 'responded': return 'تم الرد';
      case 'flagged': return 'مُبلغ عنه';
    }
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const responseRate = reviews.filter(r => r.status === 'responded').length / totalReviews * 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إدارة السمعة والمراجعات</h1>
          <p className="text-gray-500 text-xs mt-1">مراقبة وإدارة المراجعات عبر منصات الحجز المختلفة</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <ExternalLink size={15} />
          <span>مراجعة المنصات</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">متوسط التقييم العام</span>
            <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
              {averageRating.toFixed(1)}
              <Star size={16} className="text-amber-400" />
            </div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Award size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي المراجعات</span>
            <div className="text-lg font-bold text-white font-mono">{totalReviews}</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
            <MessageSquare size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">معدل الرد</span>
            <div className="text-lg font-bold text-white font-mono">{responseRate.toFixed(0)}%</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">المراجعات الجديدة</span>
            <div className="text-lg font-bold text-white font-mono">{reviews.filter(r => r.status === 'new').length}</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <AlertCircle size={16} />
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['google', 'booking', 'tripadvisor', 'expedia'].map((platform) => {
          const platformReviews = reviews.filter(r => r.platform === platform);
          const platformRating = platformReviews.length > 0 
            ? platformReviews.reduce((sum, r) => sum + r.rating, 0) / platformReviews.length 
            : 0;
          return (
            <div key={platform} className="p-4 bg-[#0b0b0b] border border-gray-900 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-[#D4AF37]" />
                <span className="text-sm font-bold text-white capitalize">{getPlatformLabel(platform as any)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white font-mono">{platformRating.toFixed(1)}</span>
                <Star size={14} className="text-amber-400" />
              </div>
              <div className="text-xs text-gray-500 mt-1">{platformReviews.length} مراجعة</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">المنصة:</span>
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            {['all', 'google', 'booking', 'tripadvisor', 'expedia'].map((platform) => (
              <button
                key={platform}
                onClick={() => setFilter(platform as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === platform ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {platform === 'all' ? 'الكل' : getPlatformLabel(platform as any)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">الحالة:</span>
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            {['all', 'new', 'responded', 'flagged'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === status ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'الكل' : status === 'new' ? 'جديد' : status === 'responded' ? 'تم الرد' : 'مُبلغ عنه'}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث في المراجعات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 pr-10 text-xs text-white focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 pb-2">
                <th className="py-3 font-bold">النزيل</th>
                <th className="py-3 font-bold">المنصة</th>
                <th className="py-3 font-bold">التقييم</th>
                <th className="py-3 font-bold">التعليق</th>
                <th className="py-3 font-bold">التاريخ</th>
                <th className="py-3 font-bold">الحالة</th>
                <th className="py-3 font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-white/[0.01] transition duration-150">
                  <td className="py-4 font-bold text-white">{review.guestName}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getPlatformColor(review.platform)}`}>
                      {getPlatformLabel(review.platform)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star <= review.rating ? 'text-amber-400' : 'text-gray-700'} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-gray-300 max-w-xs truncate">{review.comment}</td>
                  <td className="py-4 text-xs text-gray-500">{review.date}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(review.status)}`}>
                      {getStatusLabel(review.status)}
                    </span>
                  </td>
                  <td className="py-4 text-left">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                        title="عرض التفاصيل"
                      >
                        <MessageSquare size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-emerald-500/30 transition"
                        title="الرد"
                      >
                        <Reply size={14} className="text-gray-400" />
                      </button>
                      <button
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-red-500/30 transition"
                        title="إبلاغ"
                      >
                        <Flag size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E6C587]">تفاصيل المراجعة</h3>
              <button onClick={() => setSelectedReview(null)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">{selectedReview.guestName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformColor(selectedReview.platform)}`}>
                    {getPlatformLabel(selectedReview.platform)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={star <= selectedReview.rating ? 'text-amber-400' : 'text-gray-700'} />
                  ))}
                </div>
                <div className="text-sm text-gray-300">{selectedReview.comment}</div>
                <div className="text-xs text-gray-500 mt-2">{selectedReview.date}</div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">الرد على المراجعة</h4>
                <textarea
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                  rows={3}
                  placeholder="اكتب ردك هنا..."
                />
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-full py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                إرسال الرد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
