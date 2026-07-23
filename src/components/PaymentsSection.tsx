import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Printer, AlertCircle, RefreshCw, FileText,
  TrendingUp, BarChart3, Filter, Search, Plus, X, Save, Download, Percent, 
  Calendar, CheckCircle2, Clock, Wallet, Building2, CreditCard as CardIcon, 
  Receipt, Calculator, PieChart, Loader2, Building, User
} from 'lucide-react';
import { Invoice } from '../types';
import { apiService } from '../services/api';
import { useThemeColors } from '../hooks/useThemeColors';

interface PaymentsSectionProps {
  invoices?: Invoice[];
  onUpdateInvoiceStatus?: (invId: string, status: Invoice['status']) => void;
}

export default function PaymentsSection({ invoices: initialInvoices, onUpdateInvoiceStatus }: PaymentsSectionProps) {
  const { colors, isDark } = useThemeColors();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewMode, setViewMode] = useState<'invoices' | 'taxes' | 'gateways' | 'installments'>('invoices');
  const [filter, setFilter] = useState<'all' | Invoice['status']>('all');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ignore initialInvoices prop - always use real API data
  useEffect(() => {
    loadCheckOutStays();
  }, []);

  const loadCheckOutStays = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getStaysCheckOutToday(0, 50);
      console.log('Checkout stays response:', response);
      
      // Transform stays to invoice format using real API data
      const transformedInvoices = (response.content || []).map((stay: any) => ({
        id: stay.stayId?.toString() || '-',
        guestName: stay.guestName || '-',
        roomNumber: stay.roomNumber || '-',
        amount: stay.totalCharge || 0,
        status: 'unpaid' as Invoice['status'],
        date: stay.expectedCheckOutDate ? new Date(stay.expectedCheckOutDate).toLocaleDateString('ar-SA', { calendar: 'gregory' }) : '-',
        method: 'بطاقة ائتمان',
        tax: 0,
        vat: 0,
      }));
      
      setInvoices(transformedInvoices);
    } catch (error: any) {
      console.error('Failed to load checkout stays:', error);
      setError('فشل تحميل بيانات المغادرين اليوم');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = filter === 'all' ? (invoices || []) : (invoices || []).filter(inv => inv.status === filter);

  const totalPayments = (invoices || [])
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingPayments = (invoices || [])
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const refundedPayments = (invoices || [])
    .filter(inv => inv.status === 'refunded')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const vatRate = 0.15; // 15% VAT
  const totalVAT = totalPayments * vatRate;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5 ${isDark ? 'border-gray-900' : 'border-gray-200'}`}>
        <div>
          <h1 className="text-2xl font-black" style={{ color: colors.primary.goldLight }}>العمليات المالية والفواتير</h1>
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>إصدار ومراقبة الفواتير الإلكترونية المعتمدة، وإجراء تحويلات الدفع والتسويات للنزلاء.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200" style={{ background: colors.primary.goldGradient }}>
          <Plus size={15} />
          <span>فاتورة جديدة</span>
        </button>
      </div>

      {/* View Mode Toggles */}
      <div className={`flex flex-wrap items-center gap-2 border p-3 rounded-xl ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
        {[
          { id: 'invoices', label: 'الفواتير', icon: <Receipt size={14} /> },
          { id: 'taxes', label: 'الضرائب', icon: <Calculator size={14} /> },
          { id: 'gateways', label: 'بوابات الدفع', icon: <CardIcon size={14} /> },
          { id: 'installments', label: 'الأقساط', icon: <Calendar size={14} /> }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === mode.id ? 'bg-[#D4AF37] text-black' : (isDark ? 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:text-gray-900')
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl hover:border-emerald-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>إجمالي المدفوعات</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{totalPayments.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-emerald-950/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className={`p-4 border rounded-xl hover:border-amber-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>ضريبة القيمة المضافة (15%)</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{totalVAT.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-amber-950/20 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
            <Percent size={16} />
          </div>
        </div>

        <div className={`p-4 border rounded-xl hover:border-red-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>المدفوعات المعلقة</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{pendingPayments.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-red-950/20 text-red-400' : 'bg-red-50 text-red-700'}`}>
            <AlertCircle size={16} />
          </div>
        </div>

        <div className={`p-4 border rounded-xl hover:border-purple-500/35 transition duration-200 ${isDark ? 'bg-[#090909] border-gray-900' : 'bg-white border-gray-200'}`}>
          <div className="space-y-1">
            <span className="text-[10px]" style={{ color: colors.text.muted }}>المستردات</span>
            <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{refundedPayments.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
          </div>
          <div className={`p-2 rounded-lg mt-2 ${isDark ? 'bg-purple-950/20 text-purple-400' : 'bg-purple-50 text-purple-700'}`}>
            <ArrowDownRight size={16} />
          </div>
        </div>
      </div>

      {/* Invoices View */}
      {viewMode === 'invoices' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: colors.primary.goldLight }}>
              <CreditCard size={16} style={{ color: colors.primary.gold }} />
              <span>المغادرين اليوم</span>
            </h2>
            <button
              onClick={loadCheckOutStays}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-bold transition"
              style={{ borderColor: colors.primary.gold, color: colors.primary.gold }}
            >
              <RefreshCw size={12} />
              <span>تحديث</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="text-[#D4AF37] animate-spin" size={32} />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-red-400">
                <AlertCircle size={32} className="ml-2" />
                <span>{error}</span>
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex items-center justify-center py-12" style={{ color: colors.text.muted }}>
                <span>لا توجد حجوزات للمغادرة اليوم</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invoices.map((inv) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`border rounded-xl p-5 cursor-pointer transition duration-300 hover:border-[#D4AF37]/35 ${
                      selectedInvoice?.id === inv.id ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5' : 
                      isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${colors.primary.gold}20`, borderColor: `${colors.primary.gold}30`, border: '1px solid' }}>
                          <Building size={20} style={{ color: colors.primary.goldLight }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: colors.text.primary }}>{inv.roomNumber}</h3>
                          <span className="text-[10px] font-mono" style={{ color: colors.text.muted }}>#{inv.id}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'paid' ? (isDark ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' : 'bg-emerald-50 text-emerald-700 border-emerald-200') :
                        inv.status === 'unpaid' ? (isDark ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/10' : 'bg-yellow-50 text-yellow-700 border-yellow-200') :
                        (isDark ? 'bg-red-950/40 text-red-400 border border-red-500/10' : 'bg-red-50 text-red-700 border-red-200')
                      }`}>
                        {inv.status === 'paid' ? 'مسددة' :
                         inv.status === 'unpaid' ? 'غير مسددة' :
                         'مرتجعة'}
                      </span>
                    </div>

                    {/* Guest Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={14} style={{ color: colors.text.muted }} />
                        <span className="text-xs" style={{ color: colors.text.secondary }}>{inv.guestName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} style={{ color: colors.text.muted }} />
                        <span className="text-xs" style={{ color: colors.text.secondary }}>
                          تاريخ المغادرة: {inv.date}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className={`pt-3 border-t flex justify-between items-center ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                      <span className="text-[10px]" style={{ color: colors.text.muted }}>المبلغ الإجمالي</span>
                      <span className="text-lg font-black font-mono" style={{ color: colors.primary.goldLight }}>
                        {inv.amount.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Taxes View */}
      {viewMode === 'taxes' && (
        <div className={`border rounded-xl p-6 ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary.goldLight }}>إدارة الضرائب والرسوم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 border rounded-xl ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold" style={{ color: colors.text.primary }}>ضريبة القيمة المضافة (VAT)</span>
                <span className="text-xs text-amber-400">15%</span>
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{totalVAT.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
            </div>
            <div className={`p-4 border rounded-xl ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold" style={{ color: colors.text.primary }}>ضريبة الخدمات السياحية</span>
                <span className="text-xs text-amber-400">5%</span>
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: colors.text.primary }}>{(totalPayments * 0.05).toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ريال</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateways View */}
      {viewMode === 'gateways' && (
        <div className={`border rounded-xl p-6 ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary.goldLight }}>بوابات الدفع الإلكتروني</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'مدى', status: 'نشط', icon: <Wallet size={24} /> },
              { name: 'STC Pay', status: 'نشط', icon: <CardIcon size={24} /> },
              { name: 'Visa/Mastercard', status: 'نشط', icon: <CreditCard size={24} /> },
              { name: 'Apple Pay', status: 'نشط', icon: <Building2 size={24} /> }
            ].map((gateway, idx) => (
              <div key={idx} className={`p-4 border rounded-xl text-center ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="mx-auto mb-2" style={{ color: colors.primary.gold }}>{gateway.icon}</div>
                <div className="text-sm font-bold" style={{ color: colors.text.primary }}>{gateway.name}</div>
                <div className="text-xs text-emerald-400 mt-1">{gateway.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Installments View */}
      {viewMode === 'installments' && (
        <div className={`border rounded-xl p-6 ${isDark ? 'bg-[#0b0b0b] border-gray-900' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary.goldLight }}>خطط الأقساط</h3>
          <div className="text-center py-12" style={{ color: colors.text.muted }}>
            <span>لا توجد خطط أقساط نشطة حالياً</span>
          </div>
        </div>
      )}
    </div>
  );
}
