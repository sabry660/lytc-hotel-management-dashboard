import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Sparkles, TrendingUp, AlertCircle, Target, DollarSign, 
  Calendar, Users, BarChart3, MessageSquare, Send, FileText, 
  Download, Clock, CheckCircle, Zap, Award, Lightbulb, 
  ChevronRight, X, Search, Filter, Star, Activity, Building,
  Utensils, Coffee, Heart, Wrench, Shield, Globe, Phone,
  Mail as MailIcon, ArrowUpRight, ArrowDownRight, ThumbsUp,
  ThumbsDown, Copy, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AICenterSection() {
  const [selectedReport, setSelectedReport] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'مرحباً بك في مركز الذكاء الاصطناعي لـ LYTC. أنا مساعدك الذكي المتخصص في تحليلات الفندق وتقديم التوصيات. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // AI Insights Data
  const aiInsights = [
    {
      id: 1,
      type: 'revenue_opportunity',
      title: 'فرصة زيادة الإيرادات',
      description: 'بناءً على تحليل البيانات، يمكن زيادة أسعار غرف البنتهاوس بنسبة 15% خلال عطلة نهاية الأسبوع دون التأثير على معدل الإشغال.',
      confidence: 87,
      actionable: true,
      priority: 'high',
      date: '2026-07-05'
    },
    {
      id: 2,
      type: 'occupancy_forecast',
      title: 'توقع انخفاض الإشغال',
      description: 'من المتوقع انخفاض نسبة الإشغال بنسبة 8% في الأسبوع الثالث من يوليو بسبب انتهاء موسم المؤتمرات. يُنصح ببدء حملة ترويجية.',
      confidence: 92,
      actionable: true,
      priority: 'high',
      date: '2026-07-05'
    },
    {
      id: 3,
      type: 'sentiment_analysis',
      title: 'تحليل المشاعر السلبية',
      description: 'لوحظ زيادة في الشكاوى المتعلقة بسرعة خدمة الغرف. يُنصح بزيادة عدد الموظفين خلال فترات الذروة.',
      confidence: 78,
      actionable: true,
      priority: 'medium',
      date: '2026-07-04'
    },
    {
      id: 4,
      type: 'seo_recommendation',
      title: 'توصية تحسين SEO',
      description: 'الكلمة المفتاحية "فنادق فاخرة الرياض" تراجعت للمرتبة الخامسة. يُنصح بتحديث المحتوى وبناء روابط خلفية.',
      confidence: 85,
      actionable: true,
      priority: 'medium',
      date: '2026-07-04'
    },
    {
      id: 5,
      type: 'maintenance_prediction',
      title: 'تنبؤ بالصيانة',
      description: 'نظام التكييف في الجناح 502 يظهر مؤشرات على احتمال حدوث عطل خلال 7 أيام. يُنصح بالصيانة الوقائية.',
      confidence: 73,
      actionable: true,
      priority: 'medium',
      date: '2026-07-03'
    },
    {
      id: 6,
      type: 'offer_suggestion',
      title: 'اقتراح عروض',
      description: 'العروض على خدمات السبا تحقق أداءً ممتازاً. يُنصح بإنشاء باقة "سبا وإقامة" لزيادة القيمة الدائمة للعملاء.',
      confidence: 91,
      actionable: true,
      priority: 'high',
      date: '2026-07-03'
    }
  ];

  // Revenue Prediction Data
  const revenuePredictionData = [
    { month: 'يوليو', actual: 520000, predicted: 535000 },
    { month: 'أغسطس', actual: 480000, predicted: 495000 },
    { month: 'سبتمبر', actual: 410000, predicted: 425000 },
    { month: 'أكتوبر', actual: 390000, predicted: 405000 },
    { month: 'نوفمبر', actual: 340000, predicted: 355000 },
    { month: 'ديسمبر', actual: 580000, predicted: 610000 }
  ];

  // Occupancy Forecast Data
  const occupancyForecastData = [
    { week: 'الأسبوع 1', forecast: 94, confidence: 95 },
    { week: 'الأسبوع 2', forecast: 91, confidence: 92 },
    { week: 'الأسبوع 3', forecast: 85, confidence: 88 },
    { week: 'الأسبوع 4', forecast: 89, confidence: 90 }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: inputMessage }]);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          'بناءً على تحليل البيانات الحالية، معدل الإشغال المتوقع للأسبوع القادم هو 89% مع زيادة في الطلب على غرف البنتهاوس.',
          'أفضل قناة جلبت حجوزات مباشرة هذا الشهر هي الموقع الإلكتروني بنسبة 45%، تليها Instagram بنسبة 18%.',
          'يمكن زيادة سعر غرف الجناح الملكي بنسبة 10% خلال عطلة نهاية الأسبوع دون التأثير على معدل الإشغال، بناءً على تحليل الطلب التاريخي.',
          'الخدمة الأكثر طلباً هذا الشهر هي خدمة الغرف بنسبة 35%، تليها خدمات السبا بنسبة 25%.',
          'لزيادة الإيرادات هذا الشهر، يُنصح بتركيز الحملات التسويقية على أسواق الشركات وإنشاء عروض خاصة للإقامات الطويلة.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      }, 1000);
      
      setInputMessage('');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue_opportunity': return DollarSign;
      case 'occupancy_forecast': return TrendingUp;
      case 'sentiment_analysis': return MessageSquare;
      case 'seo_recommendation': return Globe;
      case 'maintenance_prediction': return Wrench;
      case 'offer_suggestion': return Sparkles;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'revenue_opportunity': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'occupancy_forecast': return 'text-blue-400 bg-blue-950/20 border-blue-500/30';
      case 'sentiment_analysis': return 'text-purple-400 bg-purple-950/20 border-purple-500/30';
      case 'seo_recommendation': return 'text-cyan-400 bg-cyan-950/20 border-cyan-500/30';
      case 'maintenance_prediction': return 'text-orange-400 bg-orange-950/20 border-orange-500/30';
      case 'offer_suggestion': return 'text-pink-400 bg-pink-950/20 border-pink-500/30';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-950/20 border-red-500/30';
      case 'medium': return 'text-amber-400 bg-amber-950/20 border-amber-500/30';
      case 'low': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587] flex items-center gap-2">
            <Brain className="text-purple-400" />
            <span>مركز الذكاء الاصطناعي</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">تحليلات ذكية، تنبؤات، ومساعد افتراضي متخصص في إدارة الفندق.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 font-bold rounded-xl hover:text-white hover:border-gray-700 transition-all duration-300 text-sm">
            <Download size={16} />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-black text-[#E6C587] flex items-center gap-2">
            <Sparkles size={18} />
            <span>رؤى وتوصيات الذكاء الاصطناعي</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">آخر تحديث: قبل 5 دقائق</span>
            <button className="p-2 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition-all">
              <RefreshCw size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight) => {
            const InsightIcon = getInsightIcon(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#121212] border border-gray-800 rounded-xl hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type)} border`}>
                    <InsightIcon size={16} />
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${getPriorityColor(insight.priority)} border`}>
                    {insight.priority === 'high' ? 'عالية' : insight.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{insight.title}</h4>
                <p className="text-xs text-gray-400 mb-3 line-clamp-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Activity size={12} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-bold">{insight.confidence}% ثقة</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{insight.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Prediction Chart */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6 flex items-center gap-2">
            <TrendingUp size={18} />
            <span>توقع الإيرادات</span>
          </h3>
          <div className="w-full" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenuePredictionData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#D4AF37" 
                  fill="#D4AF37" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="الفعلي"
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="المتوقع"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Forecast Chart */}
        <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6 flex items-center gap-2">
            <Target size={18} />
            <span>توقع الإشغال الأسبوعي</span>
          </h3>
          <div className="w-full" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyForecastData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="week" stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6B7280" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="forecast" fill="#10B981" radius={[4, 4, 0, 0]} name="نسبة الإشغال المتوقعة" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-[#E6C587] mb-4 sm:mb-6 flex items-center gap-2">
          <MessageSquare size={18} />
          <span>المساعد الذكي</span>
        </h3>

        <div className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-4 pr-2">
            {chatMessages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#121212] border border-gray-800 text-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            {[
              'لماذا انخفضت نسبة الإشغال؟',
              'ما أفضل قناة جلبت حجوزات مباشرة؟',
              'أي نوع من الغرف يمكن زيادة سعره؟',
              'ما أكثر الخدمات طلباً؟',
              'كيف يمكن زيادة الإيرادات هذا الشهر؟'
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(question)}
                className="px-3 py-2 bg-[#121212] border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white hover:border-[#D4AF37]/30 transition-all"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="اكتب سؤالك هنا..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-gradient-to-r from-[#AA7B30] via-[#D4AF37] to-[#E6C587] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Reports */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-gray-900 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-black text-[#E6C587] flex items-center gap-2">
            <FileText size={18} />
            <span>تقارير الذكاء الاصطناعي</span>
          </h3>
          <div className="flex items-center gap-2 bg-[#121212] border border-gray-800 rounded-xl p-1">
            {[
              { key: 'daily', label: 'يومي' },
              { key: 'weekly', label: 'أسبوعي' },
              { key: 'monthly', label: 'شهري' }
            ].map((report) => (
              <button
                key={report.key}
                onClick={() => setSelectedReport(report.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedReport === report.key
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {report.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-emerald-400" />
              <span className="text-xs text-gray-500">الإيرادات المتوقعة</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">535,000 <span className="text-sm text-[#E6C587]">ريال</span></div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
              <ArrowUpRight size={12} />
              <span>+2.9%</span>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-blue-400" />
              <span className="text-xs text-gray-500">نسبة الإشغال المتوقعة</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">89%</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
              <ArrowDownRight size={12} />
              <span>-3%</span>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-amber-400" />
              <span className="text-xs text-gray-500">معدل الرضا المتوقع</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">4.8</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
              <ArrowUpRight size={12} />
              <span>+0.2</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-[#121212] border border-gray-800 rounded-xl">
          <h4 className="text-sm font-bold text-[#E6C587] mb-3">الملخص التنفيذي</h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            بناءً على التحليلات المتقدمة، يظهر الأداء العام للفندق تحسناً ملحوظاً في الإيرادات مع استقرار في معدل الإشغال. 
            يُنصح بالتركيز على تحسين خدمة الغرف وتفعيل حملات ترويجية مستهدفة لأسواق الشركات خلال الأسبوع القادم.
            التنبؤات تشير إلى فرصة قوية لزيادة الأسعار خلال عطلة نهاية الأسبوع مع الحفاظ على مستويات الإشغال الحالية.
          </p>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121212] border border-[#D4AF37]/30 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString('ar-SA')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
