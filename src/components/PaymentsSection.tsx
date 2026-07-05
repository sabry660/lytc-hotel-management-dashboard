import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Printer, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Invoice } from '../types';

interface PaymentsSectionProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus: (invId: string, status: Invoice['status']) => void;
}

export default function PaymentsSection({ invoices, onUpdateInvoiceStatus }: PaymentsSectionProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalPayments = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingPayments = invoices
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const refundedPayments = invoices
    .filter(inv => inv.status === 'refunded')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">العمليات المالية والفواتير</h1>
          <p className="text-gray-500 text-xs mt-1">إصدار ومراقبة الفواتير الإلكترونية المعتمدة، وإجراء تحويلات الدفع والتسويات للنزلاء.</p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-emerald-500/25 transition duration-200 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold block">إجمالي المدفوعات المستلمة:</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {totalPayments.toLocaleString('ar-SA')} <span className="text-xs font-sans">ريال</span>
            </span>
          </div>
          <div className="p-3 bg-emerald-950/20 text-emerald-400 rounded-xl">
            <ArrowUpRight size={22} />
          </div>
        </div>

        <div className="p-6 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-yellow-500/25 transition duration-200 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold block">مستحقات معلقة بانتظار التحصيل:</span>
            <span className="text-2xl font-black text-amber-500 font-mono">
              {pendingPayments.toLocaleString('ar-SA')} <span className="text-xs font-sans">ريال</span>
            </span>
          </div>
          <div className="p-3 bg-amber-950/20 text-amber-500 rounded-xl">
            <AlertCircle size={22} />
          </div>
        </div>

        <div className="p-6 bg-[#0b0b0b] border border-gray-900 rounded-xl hover:border-red-500/25 transition duration-200 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold block">مبالغ مستردة وتسويات:</span>
            <span className="text-2xl font-black text-red-400 font-mono">
              {refundedPayments.toLocaleString('ar-SA')} <span className="text-xs font-sans">ريال</span>
            </span>
          </div>
          <div className="p-3 bg-red-950/20 text-red-400 rounded-xl">
            <ArrowDownRight size={22} />
          </div>
        </div>
      </div>

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
    </div>
  );
}
