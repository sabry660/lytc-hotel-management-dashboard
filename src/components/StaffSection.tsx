import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, Clock, TrendingUp, Award, Star, CheckCircle2, AlertCircle, 
  Filter, Search, Download, Printer, Plus, X, Save, BarChart3, Timer, 
  MapPin, Phone, Mail as MailIcon, Briefcase, UserCheck, UserX, Edit, Eye
} from 'lucide-react';
import { Staff } from '../types';

interface StaffSectionProps {
  staff: Staff[];
  onUpdateStaffStatus: (staffId: string, status: Staff['status']) => void;
}

export default function StaffSection({ staff, onUpdateStaffStatus }: StaffSectionProps) {
  const [filter, setFilter] = useState<'all' | Staff['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | string>('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = staff.filter(person => {
    const statusMatch = filter === 'all' || person.status === filter;
    const departmentMatch = departmentFilter === 'all' || person.department === departmentFilter;
    const searchMatch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      person.position.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && departmentMatch && searchMatch;
  });

  const departments = Array.from(new Set(staff.map(s => s.department)));

  const getStatusColor = (status: Staff['status']) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'on_leave': return 'text-amber-400 bg-amber-950/20 border-amber-500/30';
      case 'inactive': return 'text-gray-400 bg-gray-900 border-gray-700';
    }
  };

  const getStatusLabel = (status: Staff['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'on_leave': return 'في إجازة';
      case 'inactive': return 'غير نشط';
    }
  };

  const getAttendanceStats = (attendance: any) => {
    if (!attendance || attendance.length === 0) return { present: 0, absent: 0, late: 0 };
    return {
      present: attendance.filter((a: any) => a.status === 'present').length,
      absent: attendance.filter((a: any) => a.status === 'absent').length,
      late: attendance.filter((a: any) => a.status === 'late').length
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إدارة الموظفين</h1>
          <p className="text-gray-500 text-xs mt-1">تتبع الحضور، الأداء، وجداول العمل لجميع الموظفين</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200">
          <Plus size={15} />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-emerald-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">إجمالي الموظفين</span>
            <div className="text-lg font-bold text-white font-mono">{staff.length}</div>
          </div>
          <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-lg mt-2">
            <Users size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-blue-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">نسبة الحضور اليوم</span>
            <div className="text-lg font-bold text-white font-mono">94%</div>
          </div>
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded-lg mt-2">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-purple-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">متوسط الأداء</span>
            <div className="text-lg font-bold text-white font-mono">4.6/5</div>
          </div>
          <div className="p-2 bg-purple-950/20 text-purple-400 rounded-lg mt-2">
            <Star size={16} />
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-gray-900 rounded-xl hover:border-amber-500/35 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500">الموظفون في إجازة</span>
            <div className="text-lg font-bold text-white font-mono">{staff.filter(s => s.status === 'on_leave').length}</div>
          </div>
          <div className="p-2 bg-amber-950/20 text-amber-400 rounded-lg mt-2">
            <Calendar size={16} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">الحالة:</span>
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            {['all', 'active', 'on_leave', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === status ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'الكل' : status === 'active' ? 'نشط' : status === 'on_leave' ? 'في إجازة' : 'غير نشط'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">القسم:</span>
          <div className="flex items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setDepartmentFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                departmentFilter === 'all' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  departmentFilter === dept ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث بالاسم أو المسمى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 pr-10 text-xs text-white focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-[#0b0b0b] border border-gray-900 rounded-xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 pb-2">
                <th className="py-3 font-bold">الموظف</th>
                <th className="py-3 font-bold">المسمى الوظيفي</th>
                <th className="py-3 font-bold">القسم</th>
                <th className="py-3 font-bold">الحالة</th>
                <th className="py-3 font-bold">الأداء</th>
                <th className="py-3 font-bold">المهام المنجزة</th>
                <th className="py-3 font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {filteredStaff.map((person) => (
                <tr key={person.id} className="hover:bg-white/[0.01] transition duration-150">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                        <UserCheck size={18} className="text-[#E6C587]" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{person.name}</div>
                        <div className="text-xs text-gray-500">{person.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300">{person.position}</td>
                  <td className="py-4 text-gray-400">{person.department}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(person.status)}`}>
                      {getStatusLabel(person.status)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400" />
                      <span className="text-white font-bold">{person.performance?.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white font-mono">{person.completedTasks || 0}</td>
                  <td className="py-4 text-left">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStaff(person)}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                        title="عرض التفاصيل"
                      >
                        <Eye size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => onUpdateStaffStatus(person.id, person.status === 'active' ? 'on_leave' : 'active')}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
                        title="تغيير الحالة"
                      >
                        <Edit size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E6C587]">تفاصيل الموظف - {selectedStaff.name}</h3>
              <button onClick={() => setSelectedStaff(null)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Personal Info */}
              <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                <h4 className="text-sm font-bold text-[#E6C587] mb-3">المعلومات الشخصية</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">البريد الإلكتروني</span>
                    <span className="text-white">{selectedStaff.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">رقم الهاتف</span>
                    <span className="text-white">{selectedStaff.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">المسمى الوظيفي</span>
                    <span className="text-white">{selectedStaff.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">القسم</span>
                    <span className="text-white">{selectedStaff.department}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              {selectedStaff.performance && (
                <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                  <h4 className="text-sm font-bold text-[#E6C587] mb-3">مقاييس الأداء</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 block">التقييم العام</span>
                      <span className="text-white font-bold">{selectedStaff.performance.rating}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">المهام المنجزة</span>
                      <span className="text-white font-bold">{selectedStaff.performance.completedTasks}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">رضا العملاء</span>
                      <span className="text-white font-bold">{selectedStaff.performance.customerSatisfaction}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">الكفاءة</span>
                      <span className="text-white font-bold">{selectedStaff.performance.efficiency}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance */}
              {selectedStaff.attendance && selectedStaff.attendance.length > 0 && (
                <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                  <h4 className="text-sm font-bold text-[#E6C587] mb-3">سجل الحضور</h4>
                  <div className="space-y-2">
                    {selectedStaff.attendance.map((record, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#090909] rounded-lg">
                        <div>
                          <span className="text-white">{record.date}</span>
                          <span className="text-gray-500 mr-2">{record.checkIn} - {record.checkOut}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          record.status === 'present' ? 'text-emerald-400 bg-emerald-950/20' :
                          record.status === 'late' ? 'text-amber-400 bg-amber-950/20' :
                          record.status === 'absent' ? 'text-red-400 bg-red-950/20' :
                          'text-gray-400 bg-gray-900'
                        }`}>
                          {record.status === 'present' ? 'حاضر' : record.status === 'late' ? 'متأخر' : record.status === 'absent' ? 'غائب' : 'إجازة'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shift Schedule */}
              {selectedStaff.shiftSchedule && selectedStaff.shiftSchedule.length > 0 && (
                <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                  <h4 className="text-sm font-bold text-[#E6C587] mb-3">جدول العمل</h4>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {selectedStaff.shiftSchedule.map((shift, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-[#090909] rounded-lg">
                        <span className="text-white">{shift.day}</span>
                        <span className="text-gray-400">{shift.startTime} - {shift.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rewards */}
              {selectedStaff.rewards && selectedStaff.rewards.length > 0 && (
                <div className="p-4 bg-[#121212] border border-gray-800 rounded-xl">
                  <h4 className="text-sm font-bold text-[#E6C587] mb-3">المكافآت</h4>
                  <div className="space-y-2">
                    {selectedStaff.rewards.map((reward, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#090909] rounded-lg">
                        <div>
                          <span className="text-white">{reward.type}</span>
                          <span className="text-gray-500 mr-2">{reward.date}</span>
                        </div>
                        <span className="text-amber-400">{reward.amount.toLocaleString('ar-SA')} ريال</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
