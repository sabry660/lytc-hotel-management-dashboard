import React from 'react';
import { Sparkles, Trash2, Clock, CheckCircle2, User, Play, Check } from 'lucide-react';
import { HousekeepingTask } from '../types';

interface HousekeepingSectionProps {
  tasks: HousekeepingTask[];
  onUpdateTaskStatus: (taskId: string, status: HousekeepingTask['status']) => void;
}

export default function HousekeepingSection({ tasks, onUpdateTaskStatus }: HousekeepingSectionProps) {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">جدول النظافة والخدمات الفندقية</h1>
          <p className="text-gray-500 text-xs mt-1">تتبع مهام التنظيف الدوري، والتعقيم للأجنحة الشاغرة وتوزيعها على الطاقم التشغيلي.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Statistics Widgets */}
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">الغرف بانتظار التنظيف الفوري:</span>
          <span className="text-2xl font-black text-amber-500 font-mono">
            {tasks.filter(t => t.status === 'pending').length} غرف
          </span>
        </div>
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">غرف قيد العمل حالياً:</span>
          <span className="text-2xl font-black text-blue-400 font-mono">
            {tasks.filter(t => t.status === 'cleaning').length} غرف
          </span>
        </div>
        <div className="p-5 bg-[#0b0b0b] border border-gray-900 rounded-xl space-y-1">
          <span className="text-xs text-gray-500 font-bold block">الغرف المعقمة بالكامل لليوم:</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {tasks.filter(t => t.status === 'completed').length} غرف
          </span>
        </div>
      </div>

      {/* Main tasks lists */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#E6C587] flex items-center gap-2">
          <Sparkles className="text-[#D4AF37]" size={18} />
          <span>جدول توزيع المهام والتعقيم</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 pb-2">
                <th className="py-3 font-bold">الوحدة / الغرفة</th>
                <th className="py-3 font-bold">الموظف المعين</th>
                <th className="py-3 font-bold">مستوى الأولوية</th>
                <th className="py-3 font-bold">آخر موعد تنظيف</th>
                <th className="py-3 font-bold text-left">الحالة والإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.01] transition duration-150">
                  <td className="py-4 font-black text-white">غرفة {task.roomNumber}</td>
                  <td className="py-4 font-semibold text-gray-300">👤 {task.assignee}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'high' ? 'bg-red-950/40 text-red-400 border border-red-500/10' :
                      task.priority === 'medium' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/10' :
                      'bg-gray-900 text-gray-400'
                    }`}>
                      {task.priority === 'high' ? 'عاجل جداً' :
                       task.priority === 'medium' ? 'متوسط' :
                       'عادي'}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-gray-500">{task.lastCleaned || 'منذ يومين'}</td>
                  <td className="py-4 text-left">
                    <div className="inline-flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        task.status === 'completed' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' :
                        task.status === 'cleaning' ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' :
                        'bg-amber-950/40 text-amber-500 border-amber-500/20'
                      }`}>
                        {task.status === 'completed' ? 'معقمة ومكتملة' :
                         task.status === 'cleaning' ? 'جاري التنظيف الآن' :
                         'بانتظار العمل'}
                      </span>

                      {task.status === 'pending' && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'cleaning')}
                          className="px-2.5 py-1 bg-blue-950/30 text-blue-400 hover:bg-blue-900/30 rounded-lg text-xs font-bold flex items-center gap-1 border border-blue-500/20"
                        >
                          <Play size={11} />
                          <span>بدء</span>
                        </button>
                      )}

                      {task.status === 'cleaning' && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                          className="px-2.5 py-1 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/30 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-500/20"
                        >
                          <Check size={11} />
                          <span>تم التنظيف</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
