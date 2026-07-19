import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, Sparkles, RefreshCw, Download, FileText, Printer, Share, Copy,
  Globe, Facebook, Instagram, Camera, Bot, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

import { mockAnalyticsReport } from './mock/mockAnalyticsReport';
import { AnalyticsReport, WorkflowStep, PlatformStatus } from './types';

import SectionHeader from './components/SectionHeader';
import SummaryCard from './components/SummaryCard';
import PlatformCard from './components/PlatformCard';
import ScoreCard from './components/ScoreCard';
import InsightCard from './components/InsightCard';
import SwotCard from './components/SwotCard';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ExportButtons from './components/ExportButtons';
import NotificationToast from './components/NotificationToast';
import AnalyticsLineChart from './components/LineChart';
import AnalyticsBarChart from './components/BarChart';

export default function AnalyticsPage() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [notification, setNotification] = useState<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; timestamp: string; read: boolean } | null>(null);

  const workflowStepsList: WorkflowStep[] = [
    { id: 1, title: 'التحقق من الاتصال بالحسابات', status: 'pending' },
    { id: 2, title: 'جمع بيانات الموقع', status: 'pending' },
    { id: 3, title: 'جمع بيانات Facebook', status: 'pending' },
    { id: 4, title: 'جمع بيانات Instagram', status: 'pending' },
    { id: 5, title: 'جمع بيانات Snapchat', status: 'pending' },
    { id: 6, title: 'تجميع البيانات', status: 'pending' },
    { id: 7, title: 'إعداد التحليل', status: 'pending' },
    { id: 8, title: 'إرسال البيانات إلى Gemini', status: 'pending' },
    { id: 9, title: 'إنشاء التقرير', status: 'pending' },
    { id: 10, title: 'حفظ التقرير', status: 'pending' },
    { id: 11, title: 'عرض النتائج', status: 'pending' }
  ];

  const platforms = [
    {
      name: 'تحليلات الموقع',
      logo: <Globe className="w-6 h-6 text-blue-400" />,
      status: 'connected' as PlatformStatus,
      lastSync: 'منذ 5 دقائق',
      apiHealth: 'جيد',
      lastSuccessfulUpdate: 'منذ 5 دقائق'
    },
    {
      name: 'Facebook',
      logo: <Facebook className="w-6 h-6 text-blue-600" />,
      status: 'connected' as PlatformStatus,
      lastSync: 'منذ 10 دقائق',
      apiHealth: 'جيد',
      lastSuccessfulUpdate: 'منذ 10 دقائق'
    },
    {
      name: 'Instagram',
      logo: <Instagram className="w-6 h-6 text-pink-500" />,
      status: 'connected' as PlatformStatus,
      lastSync: 'منذ 15 دقيقة',
      apiHealth: 'جيد',
      lastSuccessfulUpdate: 'منذ 15 دقيقة'
    },
    {
      name: 'Snapchat',
      logo: <Camera className="w-6 h-6 text-yellow-400" />,
      status: 'connected' as PlatformStatus,
      lastSync: 'منذ 20 دقيقة',
      apiHealth: 'جيد',
      lastSuccessfulUpdate: 'منذ 20 دقيقة'
    },
    {
      name: 'Gemini AI',
      logo: <Bot className="w-6 h-6 text-purple-400" />,
      status: 'connected' as PlatformStatus,
      lastSync: 'منذ 30 دقيقة',
      apiHealth: 'ممتاز',
      lastSuccessfulUpdate: 'منذ 30 دقيقة'
    }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setWorkflowSteps(workflowStepsList.map(step => ({ ...step, status: 'pending' })));
    setCurrentStep(0);

    for (let i = 0; i < workflowStepsList.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setWorkflowSteps(prev => 
        prev.map((step, index) => 
          index === i ? { ...step, status: 'completed' } : 
          index === i + 1 ? { ...step, status: 'in_progress' } : step
        )
      );
      setCurrentStep(i + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setReport(mockAnalyticsReport);
    setIsGenerating(false);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setReport(mockAnalyticsReport);
      setIsLoading(false);
    }, 2000);
  };

  const handleExportPDF = () => {
    alert('تصدير PDF - سيتم تنفيذ هذه الميزة عند توفر الـ backend');
  };

  const handleExportDOCX = () => {
    alert('تصدير DOCX - سيتم تنفيذ هذه الميزة عند توفر الـ backend');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('مشاركة التقرير - سيتم تنفيذ هذه الميزة عند توفر الـ backend');
  };

  const handleCopySummary = () => {
    if (report) {
      navigator.clipboard.writeText(report.executiveSummary.aiSummary);
      setNotification({
        id: Date.now().toString(),
        type: 'success',
        message: 'تم نسخ الملخص بنجاح',
        timestamp: new Date().toLocaleTimeString('ar-SA'),
        read: false
      });
    }
  };

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      read: false
    });
  };

  if (isLoading) {
    return <LoadingState message="جاري تحميل التقرير..." estimatedTime="5 ثواني" />;
  }

  if (error) {
    return (
      <ErrorState
        title="حدث خطأ أثناء تحميل التقرير"
        description={error}
        onRetry={handleRefreshData}
      />
    );
  }

  if (!report && !isGenerating) {
    return (
      <div className="space-y-6 pb-12">
        <SectionHeader
          title="التحليلات الذكية"
          subtitle="تحليل شامل لأداء الفندق والموقع الإلكتروني ومنصات التواصل الاجتماعي باستخدام الذكاء الاصطناعي"
          actions={
            <ExportButtons
              onExportPDF={handleExportPDF}
              onExportDOCX={handleExportDOCX}
              onPrint={handlePrint}
              onShare={handleShare}
              onCopySummary={handleCopySummary}
            />
          }
        />
        
        <EmptyState
          title="لا يوجد أي تقرير حتى الآن"
          description="اضغط على 'إنشاء التقرير الذكي' لإنشاء أول تقرير شامل"
          actionText="إنشاء التقرير الذكي"
          onAction={handleGenerateReport}
        />
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-6 pb-12">
        <SectionHeader
          title="التحليلات الذكية"
          subtitle="جاري إنشاء التقرير الذكي"
        />
        
        <div className="p-8 bg-[#090909] border border-gray-900 rounded-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-24 h-24 border-4 border-gray-800 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          </div>

          <div className="space-y-3">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  step.status === 'completed' ? 'bg-emerald-950/20' :
                  step.status === 'in_progress' ? 'bg-[#D4AF37]/20' :
                  'bg-[#121212]'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : step.status === 'in_progress' ? (
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-700 rounded-full" />
                )}
                <span className={`text-sm ${
                  step.status === 'completed' ? 'text-emerald-400' :
                  step.status === 'in_progress' ? 'text-[#D4AF37]' :
                  'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / workflowSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-l from-[#AA7B30] to-[#D4AF37] rounded-full"
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              {currentStep} من {workflowSteps.length} خطوات
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        title="التحليلات الذكية"
        subtitle="تحليل شامل لأداء الفندق والموقع الإلكتروني ومنصات التواصل الاجتماعي باستخدام الذكاء الاصطناعي"
        actions={
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>إنشاء تقرير ذكي</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefreshData}
              className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-gray-800 hover:border-[#D4AF37]/50 text-white font-bold text-xs rounded-xl transition duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تحديث البيانات</span>
            </motion.button>
            <ExportButtons
              onExportPDF={handleExportPDF}
              onExportDOCX={handleExportDOCX}
              onPrint={handlePrint}
              onShare={handleShare}
              onCopySummary={handleCopySummary}
            />
          </div>
        }
      />

      {/* Connected Platforms */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">المنصات المتصلة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {platforms.map((platform, index) => (
            <PlatformCard 
              key={index} 
              name={platform.name} 
              logo={platform.logo} 
              status={platform.status} 
              lastSync={platform.lastSync} 
              apiHealth={platform.apiHealth} 
              lastSuccessfulUpdate={platform.lastSuccessfulUpdate} 
            />
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">الملخص التنفيذي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="النتيجة الإجمالية"
            value={report.executiveSummary.overallScore}
            description="من أصل 100"
            color="#D4AF37"
          />
          <SummaryCard
            title="حالة الأداء"
            value={report.executiveSummary.performanceStatus}
            description="التقييم العام"
            color="#10B981"
          />
          <SummaryCard
            title="النمو العام"
            value={`${report.executiveSummary.overallGrowth}%`}
            description="مقارنة بالشهر الماضي"
            color="#3B82F6"
            trend="up"
            trendValue={report.executiveSummary.overallGrowth}
          />
          <SummaryCard
            title="الصحة الرقمية"
            value={report.executiveSummary.digitalHealthScore}
            description="من أصل 100"
            color="#8B5CF6"
          />
        </div>
        <div className="p-4 bg-[#121212] rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">{report.executiveSummary.aiSummary}</p>
        </div>
      </div>

      {/* Overall Scores */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">النتائج الإجمالية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.overallScores.map((score, index) => (
            <ScoreCard 
              key={index} 
              name={score.name} 
              score={score.score} 
              description={score.description} 
              color={score.color} 
              trend={score.trend} 
              trendValue={score.trendValue} 
            />
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">رؤى الذكاء الاصطناعي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.aiInsights.strengths.map((insight, index) => (
            <InsightCard 
              key={index} 
              insight={insight} 
            />
          ))}
        </div>
      </div>

      {/* SWOT Analysis */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">تحليل SWOT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SwotCard
            title="نقاط القوة"
            items={report.swotAnalysis.strengths}
            color="#10B981"
            icon={<CheckCircle2 className="w-6 h-6" />}
          />
          <SwotCard
            title="نقاط الضعف"
            items={report.swotAnalysis.weaknesses}
            color="#EF4444"
            icon={<XCircle className="w-6 h-6" />}
          />
          <SwotCard
            title="الفرص"
            items={report.swotAnalysis.opportunities}
            color="#3B82F6"
            icon={<Sparkles className="w-6 h-6" />}
          />
          <SwotCard
            title="التهديدات"
            items={report.swotAnalysis.threats}
            color="#F59E0B"
            icon={<AlertCircle className="w-6 h-6" />}
          />
        </div>
      </div>

      {/* Website Analytics */}
      <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">تحليلات الموقع الإلكتروني</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="الزوار"
            value={report.websiteAnalytics.visitors.toLocaleString()}
            description="إجمالي الزوار"
            color="#3B82F6"
            trend="up"
            trendValue={report.websiteAnalytics.growthPercentage}
          />
          <SummaryCard
            title="الجلسات"
            value={report.websiteAnalytics.sessions.toLocaleString()}
            description="إجمالي الجلسات"
            color="#10B981"
          />
          <SummaryCard
            title="الزوار الفريدين"
            value={report.websiteAnalytics.uniqueVisitors.toLocaleString()}
            description="زوار جدد"
            color="#8B5CF6"
          />
          <SummaryCard
            title="معدل الارتداد"
            value={`${report.websiteAnalytics.bounceRate}%`}
            description="معدل الخروج"
            color="#F59E0B"
          />
          <SummaryCard
            title="مدة الجلسة"
            value={`${Math.floor(report.websiteAnalytics.averageSessionDuration / 60)}:${(report.websiteAnalytics.averageSessionDuration % 60).toString().padStart(2, '0')}`}
            description="متوسط المدة"
            color="#EC4899"
          />
          <SummaryCard
            title="الصفحات لكل جلسة"
            value={report.websiteAnalytics.pagesPerSession.toFixed(1)}
            description="متوسط الصفحات"
            color="#06B6D4"
          />
          <SummaryCard
            title="معدل التحويل"
            value={`${report.websiteAnalytics.conversionRate}%`}
            description="معدل التحويل"
            color="#EF4444"
          />
          <SummaryCard
            title="النمو"
            value={`${report.websiteAnalytics.growthPercentage}%`}
            description="نمو الزوار"
            color="#D4AF37"
            trend="up"
            trendValue={report.websiteAnalytics.growthPercentage}
          />
        </div>
      </div>

      {/* Social Media Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Facebook */}
        <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Facebook className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-white">Facebook</h3>
          </div>
          <div className="space-y-3">
            <SummaryCard
              title="المتابعين"
              value={report.facebookAnalytics.followers.toLocaleString()}
              description="إجمالي المتابعين"
              color="#1877F2"
            />
            <SummaryCard
              title="الوصول"
              value={report.facebookAnalytics.reach.toLocaleString()}
              description="إجمالي الوصول"
              color="#42B72A"
            />
            <SummaryCard
              title="التفاعل"
              value={`${report.facebookAnalytics.engagement}%`}
              description="معدل التفاعل"
              color="#F59E0B"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Instagram className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg font-bold text-white">Instagram</h3>
          </div>
          <div className="space-y-3">
            <SummaryCard
              title="المتابعين"
              value={report.instagramAnalytics.followers.toLocaleString()}
              description="إجمالي المتابعين"
              color="#E1306C"
            />
            <SummaryCard
              title="الوصول"
              value={report.instagramAnalytics.reach.toLocaleString()}
              description="إجمالي الوصول"
              color="#C13584"
            />
            <SummaryCard
              title="التفاعل"
              value={`${report.instagramAnalytics.engagement}%`}
              description="معدل التفاعل"
              color="#F59E0B"
            />
          </div>
        </div>

        {/* Snapchat */}
        <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Snapchat</h3>
          </div>
          <div className="space-y-3">
            <SummaryCard
              title="المشتركين"
              value={report.snapchatAnalytics.subscribers.toLocaleString()}
              description="إجمالي المشتركين"
              color="#FFFC00"
            />
            <SummaryCard
              title="مشاهدات القصص"
              value={report.snapchatAnalytics.storyViews.toLocaleString()}
              description="إجمالي المشاهدات"
              color="#FFFC00"
            />
            <SummaryCard
              title="التفاعل"
              value={`${report.snapchatAnalytics.engagement}%`}
              description="معدل التفاعل"
              color="#F59E0B"
            />
          </div>
        </div>
      </div>

      {/* Monthly Action Plan */}
      <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">خطة العمل الشهرية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#121212] rounded-lg">
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3">الأسبوع الأول</h4>
            <div className="space-y-2">
              {report.monthlyActionPlan.week1.map((task, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{task.task}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-950/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-950/20 text-amber-400' :
                      'bg-emerald-950/20 text-emerald-400'
                    }`}>
                      {task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] rounded-full" 
                      style={{ width: `${task.completionProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-[#121212] rounded-lg">
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3">الأسبوع الثاني</h4>
            <div className="space-y-2">
              {report.monthlyActionPlan.week2.map((task, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{task.task}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-950/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-950/20 text-amber-400' :
                      'bg-emerald-950/20 text-emerald-400'
                    }`}>
                      {task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] rounded-full" 
                      style={{ width: `${task.completionProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-[#121212] rounded-lg">
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3">الأسبوع الثالث</h4>
            <div className="space-y-2">
              {report.monthlyActionPlan.week3.map((task, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{task.task}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-950/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-950/20 text-amber-400' :
                      'bg-emerald-950/20 text-emerald-400'
                    }`}>
                      {task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] rounded-full" 
                      style={{ width: `${task.completionProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-[#121212] rounded-lg">
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3">الأسبوع الرابع</h4>
            <div className="space-y-2">
              {report.monthlyActionPlan.week4.map((task, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{task.task}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-950/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-950/20 text-amber-400' :
                      'bg-emerald-950/20 text-emerald-400'
                    }`}>
                      {task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] rounded-full" 
                      style={{ width: `${task.completionProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">سجل التقارير</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-right py-3 px-4 text-gray-500 font-bold">اسم التقرير</th>
                <th className="text-right py-3 px-4 text-gray-500 font-bold">تاريخ الإنشاء</th>
                <th className="text-right py-3 px-4 text-gray-500 font-bold">النوع</th>
                <th className="text-right py-3 px-4 text-gray-500 font-bold">النتيجة</th>
                <th className="text-right py-3 px-4 text-gray-500 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {report.reportHistory.map((history, index) => (
                <tr key={index} className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-gray-300">{history.reportName}</td>
                  <td className="py-3 px-4 text-gray-400">{history.generatedDate}</td>
                  <td className="py-3 px-4 text-gray-400">{history.reportType}</td>
                  <td className="py-3 px-4 text-gray-300">{history.overallScore}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full ${
                      history.status === 'completed' ? 'bg-emerald-950/20 text-emerald-400' :
                      history.status === 'failed' ? 'bg-red-950/20 text-red-400' :
                      'bg-amber-950/20 text-amber-400'
                    }`}>
                      {history.status === 'completed' ? 'مكتمل' : history.status === 'failed' ? 'فشل' : 'قيد التنفيذ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Timeline */}
      <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">الجدول الزمني للأداء</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3">التقارير السابقة</h4>
            <div className="space-y-2">
              {report.performanceTimeline.previousReports.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg">
                  <div>
                    <span className="text-xs text-gray-300">{entry.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">{entry.score}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.status === 'مكتمل' ? 'bg-emerald-950/20 text-emerald-400' :
                      'bg-red-950/20 text-red-400'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3">نمو الأداء</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">التسويق</span>
                <span className="text-gray-300">{report.performanceTimeline.marketingProgress[report.performanceTimeline.marketingProgress.length - 1]}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-[#AA7B30] to-[#D4AF37] rounded-full" 
                  style={{ width: `${report.performanceTimeline.marketingProgress[report.performanceTimeline.marketingProgress.length - 1]}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-gray-400">الموقع</span>
                <span className="text-gray-300">{report.performanceTimeline.websiteProgress[report.performanceTimeline.websiteProgress.length - 1]}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-[#AA7B30] to-[#D4AF37] rounded-full" 
                  style={{ width: `${report.performanceTimeline.websiteProgress[report.performanceTimeline.websiteProgress.length - 1]}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-gray-400">التواصل الاجتماعي</span>
                <span className="text-gray-300">{report.performanceTimeline.socialMediaProgress[report.performanceTimeline.socialMediaProgress.length - 1]}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-[#AA7B30] to-[#D4AF37] rounded-full" 
                  style={{ width: `${report.performanceTimeline.socialMediaProgress[report.performanceTimeline.socialMediaProgress.length - 1]}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
          <AnalyticsLineChart 
            data={[
              { name: 'يناير', value: 65 },
              { name: 'فبراير', value: 72 },
              { name: 'مارس', value: 68 },
              { name: 'أبريل', value: 75 },
              { name: 'مايو', value: 82 },
              { name: 'يونيو', value: 88 }
            ]}
            color="#D4AF37"
            title="نمو الزوار"
          />
        </div>
        <div className="p-6 bg-[#090909] border border-gray-900 rounded-xl">
          <AnalyticsBarChart 
            data={[
              { name: 'Facebook', value: report.facebookAnalytics.followers },
              { name: 'Instagram', value: report.instagramAnalytics.followers },
              { name: 'Snapchat', value: report.snapchatAnalytics.subscribers }
            ]}
            color="#D4AF37"
            title="متابعي التواصل الاجتماعي"
          />
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-4 z-50">
          <NotificationToast
            notification={notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
