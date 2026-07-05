import React, { useState } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, Hammer, Plus, UserCheck } from 'lucide-react';
import { MaintenanceTicket } from '../types';

interface MaintenanceSectionProps {
  tickets: MaintenanceTicket[];
  onUpdateTicketStatus: (ticketId: string, status: MaintenanceTicket['status']) => void;
}

export default function MaintenanceSection({ tickets, onUpdateTicketStatus }: MaintenanceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomNo, setRoomNo] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">مركز الصيانة والبلاغات الفنية</h1>
          <p className="text-gray-500 text-xs mt-1">تلقي وإرسال تذاكر الأعطال الكهربائية والهندسية، وتنسيق المسؤوليات مع الطاقم التقني للفندق.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 hover:border-[#D4AF37]/30 transition duration-300 flex flex-col justify-between h-56">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-500 text-[10px] font-mono rounded">
                  {ticket.id}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">غرفة {ticket.roomNumber}</h3>
                <span className="text-[10px] text-gray-500 font-mono block mt-0.5">سجل في: {ticket.dateCreated}</span>
              </div>

              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                ticket.priority === 'high' ? 'bg-red-950/40 text-red-400 border border-red-500/10' :
                ticket.priority === 'medium' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/10' :
                'bg-gray-900 text-gray-400'
              }`}>
                {ticket.priority === 'high' ? 'خطير وعاجل' :
                 ticket.priority === 'medium' ? 'متوسط الأولوية' :
                 'عادي'}
              </span>
            </div>

            {/* Issue Description */}
            <p className="text-xs text-gray-300 leading-relaxed font-semibold bg-[#121212]/60 p-3 rounded-lg border border-gray-850 my-2">
              ⚠️ {ticket.issue}
            </p>

            {/* Actions / Technician assigner */}
            <div className="border-t border-gray-800/60 pt-3 flex justify-between items-center text-xs font-semibold">
              <span className="text-gray-500 text-[10px]">
                الفني: <strong className="text-gray-300 font-sans">{ticket.technician || 'غير معين'}</strong>
              </span>

              <div className="flex items-center gap-2">
                {ticket.status === 'open' && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, 'assigned')}
                    className="px-2.5 py-1 bg-blue-950/40 text-blue-400 border border-blue-500/20 rounded-lg text-[10px]"
                  >
                    قبول التذكرة
                  </button>
                )}

                {ticket.status === 'assigned' && (
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, 'completed')}
                    className="px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px]"
                  >
                    تأكيد الإصلاح
                  </button>
                )}

                {ticket.status === 'completed' && (
                  <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>تم الإصلاح بنجاح</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
