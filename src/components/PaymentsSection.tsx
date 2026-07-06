import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Printer, AlertCircle, RefreshCw, FileText,
  TrendingUp, BarChart3, Filter, Search, Plus, X, Save, Download, Percent, 
  Calendar, CheckCircle2, Clock, Wallet, Building2, CreditCard as CardIcon, 
  Receipt, Calculator, PieChart
} from 'lucide-react';
import { Invoice } from '../types';

interface PaymentsSectionProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus: (invId: string, status: Invoice['status']) => void;
}

export default function PaymentsSection({ invoices, onUpdateInvoiceStatus }: PaymentsSectionProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewMode, setViewMode] = useState<'invoices' | 'taxes' | 'gateways' | 'installments'>('invoices');
  const [filter, setFilter] = useState<'all' | Invoice['status']>('all');

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter(inv => inv.status === filter);

  const totalPayments = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingPayments = invoices
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const refundedPayments = invoices
    .filter(inv => inv.status === 'refunded')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const vatRate = 0.15; // 15% VAT
  const totalVAT = totalPayments * vatRate;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">العمليات المالية والفواتير</h1>
          <p className="text-gray-500 text-xs mt-1">إصدار ومراقبة الفواتير الإلكترونية المعتمدة، وإجراء تحويلات الدفع والتسويات للنزلاء.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <Plus size={15} />
          <span>فاتورة جديدة</span>
        </button>
      </div>

      {/* View Mode Toggles */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0b0b0b] border border-gray-900 p-3 rounded-xl">
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
              viewMode === mode.id ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي المدفوعات</span>
            <div className="text-lg font-bold text-white font-mono">{totalPayments.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">ضريبة القيمة المضافة (15%)</span>
            <div className="text-lg font-bold text-white font-mono">{totalVAT.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Percent size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-red-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">المدفوعات المعلقة</span>
            <div className="text-lg font-bold text-white font-mono">{pendingPayments.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-red-950/20 text-red-400 rounded-lg mt-2">
            <AlertCircle size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">المستردات</span>
            <div className="text-lg font-bold text-white font-mono">{refundedPayments.toLocaleString('ar-SA')} ريال</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <ArrowDownRight size={16} />
          </div>
        </div>
      </div>

      {/* Invoices View */}
      {viewMode === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice List Panel */}
        <div className="lg:col-span-2 bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#E6C587] flex items-center gap-2">
            <CreditCard className="text-[#D4AF37]" size={16} />
            <span>قائمة الفواتير الإلكترونية المعتمدة</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 pb-2">
                  <th className="py-3 font-bold">رقم الفاتورة</th>
                  <th className="py-3 font-bold">اسم النزيل</th>
                  <th className="py-3 font-bold">رقم الجناح</th>
                  <th className="py-3 font-bold">طريقة السداد</th>
                  <th className="py-3 font-bold">الحالة</th>
                  <th className="py-3 font-bold text-left">القيمة الإجمالية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`hover:bg-white/[0.01] transition duration-150 cursor-pointer ${
                      selectedInvoice?.id === inv.id ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="py-4 font-mono font-bold text-[#D4AF37]">{inv.id}</td>
                    <td className="py-4 font-bold text-white">{inv.guestName}</td>
                    <td className="py-4 font-mono text-gray-400">{inv.roomNumber}</td>
                    <td className="py-4 text-xs text-gray-300">{inv.method}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' :
                        inv.status === 'unpaid' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/10' :
                        'bg-red-950/40 text-red-400 border border-red-500/10'
                      }`}>
                        {inv.status === 'paid' ? 'مسددة بالكامل' :
                         inv.status === 'unpaid' ? 'غير مسددة' :
                         'مرتجعة'}
                      </span>
                    </td>
                    <td className="py-4 text-left font-mono font-black text-white">
                      {inv.amount.toLocaleString('ar-SA')} ريال
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Invoice Details Block */}
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl h-fit space-y-6">
          {selectedInvoice ? (
            <>
              <div className="border-b border-gray-800 pb-4 text-center">
                <FileText className="text-[#D4AF37] mx-auto w-10 h-10 mb-2" />
                <h3 className="text-md font-bold text-white">تفاصيل ومراجعة الفاتورة</h3>
                <span className="text-xs text-gray-500 font-mono">{selectedInvoice.id} • {selectedInvoice.date}</span>
              </div>

              {/* Bill to */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-gray-800/40 pb-2">
                  <span className="text-gray-500">اسم النزيل الموجهة إليه:</span>
                  <span className="text-white font-bold">{selectedInvoice.guestName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/40 pb-2">
                  <span className="text-gray-500">الجناح والوحدة:</span>
                  <span className="text-white font-mono font-bold">غرفة {selectedInvoice.roomNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/40 pb-2">
                  <span className="text-gray-500">طريقة الدفع المعتمدة:</span>
                  <span className="text-white font-bold">{selectedInvoice.method}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/40 pb-2">
                  <span className="text-gray-500">تاريخ إصدار الفاتورة:</span>
                  <span className="text-white font-mono">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-500">القيمة الإجمالية الصافية:</span>
                  <span className="text-[#E6C587] text-lg font-black font-mono">
                    {selectedInvoice.amount.toLocaleString('ar-SA')} ريال
                  </span>
                </div>
              </div>

              {/* Status Updater Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <span className="text-gray-500 text-[10px] block font-bold mb-2">إجراء تسوية يدوية فورية:</span>
                
                {selectedInvoice.status === 'unpaid' && (
                  <button
                    onClick={() => {
                      onUpdateInvoiceStatus(selectedInvoice.id, 'paid');
                      setSelectedInvoice(prev => prev ? { ...prev, status: 'paid' } : null);
                    }}
                    className="w-full py-2.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition hover:bg-emerald-900/30"
                  >
                    تأكيد استلام وتسوية السداد المالي
                  </button>
                )}

                {selectedInvoice.status === 'paid' && (
                  <button
                    onClick={() => {
                      onUpdateInvoiceStatus(selectedInvoice.id, 'refunded');
                      setSelectedInvoice(prev => prev ? { ...prev, status: 'refunded' } : null);
                    }}
                    className="w-full py-2.5 bg-red-950/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition hover:bg-red-900/30"
                  >
                    إرجاع المبلغ وإجراء تسوية رد مالي
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => alert('جاري تواصل الخادم بمركز طباعة الفواتير اللاسلكية المعتمدة لشركة ليتك...')}
                  className="w-full py-2.5 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Printer size={13} />
                  <span>طباعة الفاتورة الضريبية الرسمية</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 space-y-3">
              <Printer size={48} className="text-gray-700 mx-auto" />
              <p className="text-sm font-bold text-gray-400">حدد فاتورة من القائمة لمراجعتها وإصدار أمر طباعة أو تسوية مالية مرتجعة</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Taxes View */}
      {viewMode === 'taxes' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">إدارة الضرائب والرسوم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">ضريبة القيمة المضافة (VAT)</span>
                <span className="text-xs text-amber-400">15%</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{totalVAT.toLocaleString('ar-SA')} ريال</div>
            </div>
            <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">ضريبة الخدمات السياحية</span>
                <span className="text-xs text-amber-400">5%</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{(totalPayments * 0.05).toLocaleString('ar-SA')} ريال</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateways View */}
      {viewMode === 'gateways' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">بوابات الدفع الإلكتروني</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'مدى', status: 'نشط', icon: <Wallet size={24} /> },
              { name: 'STC Pay', status: 'نشط', icon: <CardIcon size={24} /> },
              { name: 'Visa/Mastercard', status: 'نشط', icon: <CreditCard size={24} /> },
              { name: 'Apple Pay', status: 'نشط', icon: <Building2 size={24} /> }
            ].map((gateway, idx) => (
              <div key={idx} className="p-4 bg-[#121212] border border-gray-800 rounded-xl text-center">
                <div className="text-[#D4AF37] mx-auto mb-2">{gateway.icon}</div>
                <div className="text-sm font-bold text-white">{gateway.name}</div>
                <div className="text-xs text-emerald-400 mt-1">{gateway.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Installments View */}
      {viewMode === 'installments' && (
        <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#E6C587] mb-4">خطط الأقساط</h3>
          <div className="space-y-3">
            {[
              { guest: 'الشيخ عبد العزيز', amount: 15000, remaining: 5000, installments: 3 },
              { guest: 'السيدة فاطمة', amount: 25000, remaining: 10000, installments: 5 }
            ].map((plan, idx) => (
              <div key={idx} className="p-4 bg-[#121212] border border-gray-800 rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">{plan.guest}</div>
                  <div className="text-xs text-gray-500">المبلغ الكلي: {plan.amount.toLocaleString('ar-SA')} ريال</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-amber-400">{plan.remaining.toLocaleString('ar-SA')} ريال</div>
                  <div className="text-xs text-gray-500">{plan.installments} أقساط متبقية</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
