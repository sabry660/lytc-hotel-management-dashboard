import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User, Plus, Search, XCircle, AlertCircle, Edit, X, Save, Shield, Loader2
} from 'lucide-react';
import { apiService, UserResponse, CreateUserRequest, UpdateUserRequest } from '../services/api';

export default function UsersManagementSection() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState<string | null>(null);

  // New User Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'STAFF' | 'GUEST'>('STAFF');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getUsers(0, 50);
      setUsers(response.content || []);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!username || !password || !role) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    setIsCreatingUser(true);
    setCreateUserError(null);

    try {
      const newUser: CreateUserRequest = {
        username,
        password,
        role,
      };

      await apiService.createUser(newUser);

      // Reset form
      setUsername('');
      setPassword('');
      setRole('STAFF');
      setIsModalOpen(false);

      // Reload users
      loadUsers();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setCreateUserError('فشل إنشاء المستخدم. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateUser = async (userId: number, userData: UpdateUserRequest) => {
    try {
      console.log('Updating user:', userId, userData);
      await apiService.updateUser(userId, userData);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('فشل تحديث المستخدم. الرجاء المحاولة مرة أخرى.');
    }
  };

  // Filter users based on search
  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#E6C587]">إدارة المستخدمين</h1>
          <p className="text-gray-500 text-xs mt-1">عرض وإدارة حسابات المستخدمين في النظام</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] hover:from-[#C59740] hover:to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow-lg transition duration-200"
        >
          <Plus size={15} />
          <span>إضافة مستخدم</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#0b0b0b] border border-gray-900 p-4 rounded-xl">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الدور..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-lg px-4 py-2 pr-10 text-xs text-white focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">فشل تحميل المستخدمين</h3>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0b0b] border border-gray-900 rounded-2xl">
          <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-400 mb-2">لا يوجد مستخدمين</h3>
          <p className="text-xs text-gray-600 mb-4">ابدأ بإضافة مستخدم جديد</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-500 font-bold text-right pb-3">المعرف</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">اسم المستخدم</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الدور</th>
                <th className="text-xs text-gray-500 font-bold text-right pb-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-[#121212]/50 transition-colors">
                  <td className="py-3 text-sm text-white">{user.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-[#E6C587]" />
                      </div>
                      <span className="text-sm text-white font-bold">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      user.role === 'ADMIN' ? 'bg-purple-950/20 text-purple-400 border border-purple-500/30' :
                      user.role === 'MANAGER' ? 'bg-blue-950/20 text-blue-400 border border-blue-500/30' :
                      user.role === 'STAFF' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {user.role === 'ADMIN' ? 'مدير' : user.role === 'MANAGER' ? 'مشرف' : user.role === 'STAFF' ? 'موظف' : user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 bg-[#121212] border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition"
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
      )}

      {/* New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#E6C587]">إضافة مستخدم جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {createUserError && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-sm p-3 rounded-lg mb-4">
                {createUserError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">اسم المستخدم</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-2">الدور</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                >
                  <option value="ADMIN">مدير</option>
                  <option value="MANAGER">مشرف</option>
                  <option value="STAFF">موظف</option>
                  <option value="GUEST">ضيف</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#121212] border border-gray-800 text-gray-400 rounded-xl text-xs font-bold hover:text-white transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  disabled={isCreatingUser}
                  className="px-6 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl shadow hover:shadow-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {isCreatingUser ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      حفظ المستخدم
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
