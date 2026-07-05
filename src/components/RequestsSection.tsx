import React, { useState } from 'react';
import { MessageSquare, Clock, Filter, CheckCircle2, User, UserCheck, AlertOctagon, Coffee, Shirt, Sparkles, Navigation, ConciergeBell, Check } from 'lucide-react';
import { ServiceRequest } from '../types';

interface RequestsSectionProps {
  requests: ServiceRequest[];
  onUpdateRequestStatus: (reqId: string, status: ServiceRequest['status']) => void;
  onAssignRequest: (reqId: string, assignee: string) => void;
}

export default function RequestsSection({
  requests,
  onUpdateRequestStatus,
  onAssignRequest
}: RequestsSectionProps) {
  const [filter, setFilter] = useState<'all' | ServiceRequest['status']>('all');
  const [assigneeInputs, setAssigneeInputs] = useState<{ [key: string]: string }>({});

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const getServiceTypeLabel = (type: ServiceRequest['type']) => {
    switch (type) {
      case 'room_service': return 'خدمة الغرف والمطبخ';
      case 'laundry': return 'المغسلة والمكواة';
      case 'housekeeping': return 'خدمات النظافة والترتيب';
      case 'maintenance': return 'أعطال الصيانة والكهرباء';
      case 'taxi': return 'طلب سيارة وسائق ليموزين';
      case 'reception': return 'طلب خدمة الاستقبال والدعم';
    }
  };

  const getServiceIcon = (type: ServiceRequest['type']) => {
    switch (type) {
      case 'room_service': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'laundry': return <Shirt className="w-4 h-4 text-blue-400" />;
      case 'housekeeping': return <Sparkles className="w-4 h-4 text-[#D4AF37]" />;
      case 'maintenance': return <AlertOctagon className="w-4 h-4 text-red-400" />;
      case 'taxi': return <Navigation className="w-4 h-4 text-emerald-400" />;
      case 'reception': return <ConciergeBell className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleAssignSubmit = (reqId: string) => {
    const name = assigneeInputs[reqId];
    if (!name) return;
    onAssignRequest(reqId, name);
    // Clear input
    setAssigneeInputs(prev => ({ ...prev, [reqId]: '' }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">مركز خدمات وطلبات النزلاء</h1>
          <p className="text-gray-500 text-xs mt-1">تنسيق وإدارة طلبات النزلاء، وتوزيع المسؤوليات وتعديل الأولويات وحالات التسليم فورياً.</p>
        </div>
      </div>

      {/* Filters and Counters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-gray-400 ml-2">فلترة حسب حالة الطلب:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition duration-200 ${
              filter === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            كافة طلبات النزلاء ({requests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition duration-200 ${
              filter === 'pending' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            بانتظار التعيين ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-3 py-1.5 rounded-lg transition duration-200 ${
              filter === 'assigned' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            جاري العمل عليها ({requests.filter(r => r.status === 'assigned').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition duration-200 ${
              filter === 'completed' ? 'bg-[#D4AF37] text-black' : 'bg-[#121212] text-gray-400 border border-gray-800'
            }`}
          >
            المكتملة بنجاح ({requests.filter(r => r.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Requests Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRequests.map((req) => (
          <div key={req.id} className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-5 hover:border-[#D4AF37]/30 transition duration-300 flex flex-col justify-between space-y-4">
            
            {/* Upper row: ID, type, priority */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#121212] to-[#1a1a1a] border border-gray-800 flex items-center justify-center">
                  {getServiceIcon(req.type)}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-gray-400">{getServiceTypeLabel(req.type)}</h3>
                  <div className="text-[10px] text-[#E6C587] font-semibold mt-0.5">غرفة {req.roomNumber} • سجل في {req.timestamp}</div>
                </div>
              </div>

              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                req.priority === 'high' ? 'bg-red-950/40 text-red-400 border border-red-500/20' :
                req.priority === 'medium' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/20' :
                'bg-gray-900 text-gray-400 border border-gray-800'
              }`}>
                {req.priority === 'high' ? 'أولوية عاجلة جداً' :
                 req.priority === 'medium' ? 'أولوية متوسطة' :
                 'أولوية عادية'}
              </span>
            </div>

            {/* Details box */}
            <p className="text-xs text-gray-300 leading-relaxed font-medium bg-[#121212] border border-gray-800/50 p-4 rounded-xl">
              {req.details}
            </p>

            {/* Status & Assignment Box */}
            <div className="border-t border-gray-800/60 pt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-xs">
              <div className="space-y-1 font-semibold">
                <span className="text-gray-500 text-[10px] block">الموظف المسؤول:</span>
                {req.assignee ? (
                  <span className="text-gray-200 flex items-center gap-1">
                    <UserCheck size={12} className="text-[#D4AF37]" />
                    {req.assignee}
                  </span>
                ) : (
                  <span className="text-red-400">لم يتم تعيين أي موظف</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none w-32"
                      placeholder="اسم الموظف..."
                      value={assigneeInputs[req.id] || ''}
                      onChange={(e) => setAssigneeInputs({ ...assigneeInputs, [req.id]: e.target.value })}
                    />
                    <button
                      onClick={() => handleAssignSubmit(req.id)}
                      className="px-2 py-1 bg-blue-900 text-blue-100 rounded-lg text-[10px] font-bold"
                    >
                      تعيين
                    </button>
                  </div>
                )}

                {req.status === 'assigned' && (
                  <button
                    onClick={() => onUpdateRequestStatus(req.id, 'completed')}
                    className="px-3.5 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/40 rounded-lg font-bold flex items-center gap-1 transition"
                  >
                    <Check size={12} />
                    <span>تأكيد الإنجاز والتسليم</span>
                  </button>
                )}

                {req.status === 'completed' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 size={13} />
                    <span>تم التسليم بنجاح</span>
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
