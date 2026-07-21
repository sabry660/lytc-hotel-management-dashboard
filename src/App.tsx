import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building, Bell, Search, User, LogOut, Sparkles, Clock, Menu, X, Check, CheckCircle2,
  Calendar, BedDouble, Users, MessageSquare, Wrench, Coffee, CreditCard, BarChart3, Globe, Settings, Award, TrendingUp, Brain, Star, FileText, Shield, Crown, ShoppingBag, ShoppingBag as ShoppingBagIcon
} from 'lucide-react';

import Login from './components/Login';
import DashboardHome from './components/DashboardHome';
import RoomsSection from './components/RoomsSection';
import ReservationsSection from './components/ReservationsSection';
import GuestsSection from './components/GuestsSection';
import RequestsSection from './components/RequestsSection';
import HousekeepingSection from './components/HousekeepingSection';
import RestaurantSection from './components/RestaurantSection';
import PaymentsSection from './components/PaymentsSection';
import UsersManagementSection from './components/UsersManagementSection';
import EmployeesManagementSection from './components/EmployeesManagementSection';
import VipGuestsSection from './components/VipGuestsSection';
import RatingsSection from './components/RatingsSection';
import SpecialOrdersManagementSection from './components/SpecialOrdersManagementSection';
import RestaurantStatsSection from './components/RestaurantStatsSection';
import CafeStatsSection from './components/CafeStatsSection';
import SpecialOffersSection from './components/SpecialOffersSection';
import AnalyticsPage from './analytics/AnalyticsPage';

import { HOTEL_INFO } from './data';
import { Room, Reservation, Guest, ServiceRequest, HousekeepingTask, MaintenanceTicket, RestaurantOrder, Invoice } from './types';

export default function App() {
  // Authentication & Loading States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('lytc_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('lytc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userRoleDisplay, setUserRoleDisplay] = useState<string>('المدير');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Update role display based on user role
  useEffect(() => {
    const savedUser = localStorage.getItem('lytc_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const roleMap: { [key: string]: string } = {
          'MANAGER': 'المدير',
          'ADMIN': 'المسؤول',
          'STAFF': 'الموظف',
          'GUEST': 'الضيف'
        };
        setUserRoleDisplay(roleMap[user.role] || 'المدير');
      } catch (e) {
        setUserRoleDisplay('المدير');
      }
    }
  }, []);

  // Active view tab state with # routing
  const [activeTab, setActiveTab] = useState<'لوحة التحكم' | 'الحجوزات' | 'الغرف' | 'النزلاء' | 'المطعم' | 'المدفوعات' | 'إدارة المستخدمين' | 'إدارة الموظفين' | 'النزلاء VIP' | 'التقييمات' | 'الطلبات الخاصة' | 'إحصائيات المطعم' | 'إحصائيات المقهى' | 'العروض والمزايا' | 'الموظفين' | 'إدارة الضيوف' | 'التحليلات الذكية'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      try {
        return decodeURIComponent(hash) as any;
      } catch {
        return 'لوحة التحكم';
      }
    }
    return 'لوحة التحكم';
  });

  // Update URL hash when tab changes
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    window.location.hash = encodeURIComponent(tab);
  };

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        try {
          setActiveTab(decodeURIComponent(hash) as any);
        } catch {
          setActiveTab('لوحة التحكم');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Core Entity States (only for pages not connected to backend)
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('lytc_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('lytc_guests');
    return saved ? JSON.parse(saved) : [];
  });
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('lytc_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('lytc_housekeeping');
    return saved ? JSON.parse(saved) : [];
  });
  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('lytc_maintenance');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<RestaurantOrder[]>(() => {
    const saved = localStorage.getItem('lytc_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('lytc_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Notifications dropdown & Global search
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'وصول نزيل جديد للجناح البنتهاوس 501', time: 'منذ 15 دقيقة', read: false },
    { id: 'n2', title: 'تم اكتمال تعقيم وتجهيز الغرفة 301', time: 'منذ 34 دقيقة', read: false },
    { id: 'n3', title: 'بلاغ صيانة عاجل جديد لجناح 202', time: 'منذ ساعتين', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Quick Modal Triggers (propagated from dashboard quick links)
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [quickRequestOpen, setQuickRequestOpen] = useState(false);

  // Sync to localStorage on every state change to keep data persistent
  useEffect(() => {
    localStorage.setItem('lytc_reservations', JSON.stringify(reservations));
  }, [reservations]);
  useEffect(() => {
    localStorage.setItem('lytc_guests', JSON.stringify(guests));
  }, [guests]);
  useEffect(() => {
    localStorage.setItem('lytc_requests', JSON.stringify(requests));
  }, [requests]);
  useEffect(() => {
    localStorage.setItem('lytc_housekeeping', JSON.stringify(housekeeping));
  }, [housekeeping]);
  useEffect(() => {
    localStorage.setItem('lytc_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);
  useEffect(() => {
    localStorage.setItem('lytc_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('lytc_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Handle simulate luxury booting loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const handleLoginSuccess = (user: { name: string; email: string; role: string }) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsLoggingIn(false);
      localStorage.setItem('lytc_logged_in', 'true');
      localStorage.setItem('lytc_user', JSON.stringify(user));
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsLoggingIn(false);
      localStorage.removeItem('lytc_logged_in');
      localStorage.removeItem('lytc_user');
    }, 1200);
  };

  // State Manipulator Functions
  const handleAddReservation = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);

    setNotifications(prev => [
      { id: Date.now().toString(), title: `حجز مؤكد وجديد باسم ${newRes.guestName} للجناح ${newRes.roomNumber}`, time: 'الآن', read: false },
      ...prev
    ]);
  };

  const handleUpdateReservationStatus = (resId: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(res => res.id === resId ? { ...res, status } : res));
    const targetRes = reservations.find(r => r.id === resId);
    if (!targetRes) return;

    if (status === 'checked_out') {
      // Auto-create cleaning task
      const newTask: HousekeepingTask = {
        id: `hk-${Date.now().toString().slice(-4)}`,
        roomNumber: targetRes.roomNumber,
        status: 'pending',
        assignee: 'محمد نجيب',
        priority: 'high',
        lastCleaned: 'الآن'
      };
      setHousekeeping(prev => [newTask, ...prev]);
    }

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `تعديل حالة الإقامة للنزيل ${targetRes.guestName} إلى: ${
          status === 'checked_in' ? 'مقيم حالياً' : status === 'checked_out' ? 'مغادر للغرفة' : 'ملغي'
        }`,
        time: 'الآن',
        read: false
      },
      ...prev
    ]);
  };

  const handleUpdateRequestStatus = (reqId: string, status: ServiceRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
  };

  const handleAssignRequest = (reqId: string, assignee: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, assignee, status: 'assigned' } : r));
  };

  const handleUpdateTaskStatus = (taskId: string, status: HousekeepingTask['status']) => {
    setHousekeeping(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleUpdateTicketStatus = (ticketId: string, status: MaintenanceTicket['status']) => {
    setMaintenance(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const handleUpdateOrderStatus = (orderId: string, status: RestaurantOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdateInvoiceStatus = (invId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status } : inv));
  };

  // Global Search logic
  const searchResults = () => {
    if (!globalSearchQuery) return [];
    const lower = globalSearchQuery.toLowerCase();
    const results: Array<{ type: string; title: string; subtitle: string; actionTab: typeof activeTab }> = [];

    // Search guests
    guests.forEach(g => {
      if (g.name.toLowerCase().includes(lower)) {
        results.push({ type: 'نزيل', title: g.name, subtitle: `هاتف: ${g.phone}`, actionTab: 'النزلاء' });
      }
    });

    // Search invoices
    invoices.forEach(inv => {
      if (inv.id.toLowerCase().includes(lower) || inv.guestName.toLowerCase().includes(lower)) {
        results.push({ type: 'فاتورة', title: `فاتورة ${inv.id}`, subtitle: `للنزيل: ${inv.guestName}`, actionTab: 'المدفوعات' });
      }
    });

    return results.slice(0, 5);
  };

  // Render modular views
  const renderActiveView = () => {
    switch (activeTab) {
      case 'لوحة التحكم':
        return (
          <DashboardHome
            onNavigate={(tab) => handleTabChange(tab as any)}
            onOpenQuickBook={() => setQuickBookOpen(true)}
            onOpenQuickRequest={() => setQuickRequestOpen(true)}
          />
        );
      case 'الغرف':
        return <RoomsSection />;
      case 'الحجوزات':
        return <ReservationsSection />;
      case 'النزلاء':
        return <GuestsSection guests={guests} reservations={reservations} />;
      case 'المطعم':
        return <RestaurantSection />;
      case 'المدفوعات':
        return <PaymentsSection invoices={invoices} onUpdateInvoiceStatus={handleUpdateInvoiceStatus} />;
      case 'التحليلات الذكية':
        return <AnalyticsPage />;
      case 'إدارة المستخدمين':
        return <UsersManagementSection />;
      case 'إدارة الموظفين':
        return <EmployeesManagementSection />;
      case 'النزلاء VIP':
        return <VipGuestsSection />;
      case 'التقييمات':
        return <RatingsSection />;
      case 'الطلبات الخاصة':
        return <SpecialOrdersManagementSection />;
      case 'إحصائيات المطعم':
        return <RestaurantStatsSection />;
      case 'إحصائيات المقهى':
        return <CafeStatsSection />;
      case 'العروض والمزايا':
        return <SpecialOffersSection />;
    }
  };

  // If not logged in, render beautiful login page
  if (!isLoggedIn) {
    return (
      <>
        {isLoggingIn && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
            <Building className="w-16 h-16 text-[#D4AF37] animate-pulse mb-4" />
            <span className="text-[#E6C587] font-black text-sm tracking-widest animate-pulse">جاري فحص المدارات والتحقق الأمني الرقمي...</span>
          </div>
        )}
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 font-sans flex relative overflow-hidden">
      
      {/* Luxury Loading Boot Screen */}
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="app-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-[#030303] z-[100] flex flex-col items-center justify-center space-y-6"
          >
            <div className="inline-flex items-center justify-center p-5 rounded-full bg-gradient-to-br from-[#121212] to-[#1d1d1d] border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-bounce">
              <img src="/logo.jpg" alt="LYTC Logo" className="w-16 h-16 rounded-full object-cover" />
            </div>
            <div className="space-y-1.5 text-center">
              <h1 className="text-xl font-extrabold tracking-widest text-[#E6C587]">ليتك للفنادق والمنتجعات الفاخرة</h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-wider">LYTC HOTELS & RESORTS • ROYAL MANAGEMENT PORTAL</p>
            </div>
            <div className="w-48 h-1 bg-gray-900 rounded-full overflow-hidden relative">
              <div className="absolute top-0 right-0 h-full w-2/3 bg-gradient-to-l from-[#AA7B30] to-[#D4AF37] rounded-full animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#060606] border-l border-gray-900 shrink-0 p-6 space-y-8 relative z-20 shadow-[5px_0_30px_rgba(0,0,0,0.6)]">
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-gray-900">
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-[#D4AF37]/20">
            <img src="/logo.jpg" alt="LYTC Logo" className="w-10 h-10 rounded-lg object-cover" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#E6C587]">ليتك للضيافة الفاخرة</h2>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">LYTC LUXURY HOTELS</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {[
            { label: 'لوحة التحكم', icon: <Building size={16} /> },
            { label: 'الحجوزات', icon: <Calendar size={16} /> },
            { label: 'الغرف', icon: <BedDouble size={16} /> },
            { label: 'المطعم', icon: <Coffee size={16} /> },
            { label: 'المدفوعات', icon: <CreditCard size={16} /> },
            { label: 'التحليلات الذكية', icon: <Brain size={16} /> },
            { label: 'العروض والمزايا', icon: <Sparkles size={16} /> },
            { label: 'إدارة المستخدمين', icon: <User size={16} /> },
            { label: 'إدارة الموظفين', icon: <Award size={16} /> },
            { label: 'النزلاء VIP', icon: <Star size={16} /> },
            { label: 'التقييمات', icon: <Star size={16} /> },
            { label: 'الطلبات الخاصة', icon: <ShoppingBag size={16} /> },
            { label: 'إحصائيات المطعم', icon: <BarChart3 size={16} /> },
            { label: 'إحصائيات المقهى', icon: <BarChart3 size={16} /> }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleTabChange(item.label as any)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                activeTab === item.label
                  ? 'bg-[#D4AF37] text-black shadow-[0_5px_15px_rgba(212,175,55,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#121212] border border-transparent hover:border-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-60 transition ${
                activeTab === item.label ? 'text-black' : 'text-gray-500'
              }`}>
                ●
              </span>
            </button>
          ))}
        </nav>

        {/* Admin Footer Row */}
        <div className="pt-4 border-t border-gray-900 flex justify-between items-center text-xs">
          <div>
            <span className="text-gray-300 font-bold block">مرحباً {userRoleDisplay}</span>
            <span className="text-[10px] text-gray-500 block">نظام إدارة الفندق</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Top Coordinator Navigation Bar */}
        <header className="h-18 bg-[#060606]/90 border-b border-gray-900 px-6 flex items-center justify-between gap-6 backdrop-blur-md relative z-30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          {/* Right Part: Mobile menu triggers, Global Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 bg-gray-900 border border-gray-800 rounded-lg lg:hidden text-white hover:bg-gray-800"
            >
              <Menu size={18} />
            </button>

            {/* Global Search Interface */}
            <div className="relative w-full max-w-sm hidden sm:block">
              <input
                type="text"
                className="w-full bg-[#121212] border border-gray-800 focus:border-[#D4AF37] rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none placeholder-gray-500"
                placeholder="البحث الشامل بالنزلاء، الغرف، الفواتير..."
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />

              {/* Real-time Search Results overlay */}
              {showSearchResults && globalSearchQuery && (
                <div className="absolute top-12 right-0 w-full bg-[#0b0b0b] border border-gray-800 rounded-xl shadow-2xl p-2.5 space-y-1.5 z-50">
                  <div className="flex justify-between items-center px-1.5 pb-1 border-b border-gray-900 text-[10px] text-gray-500">
                    <span>نتائج البحث الفورية</span>
                    <button onClick={() => setShowSearchResults(false)} className="hover:text-white">إغلاق ×</button>
                  </div>
                  {searchResults().length > 0 ? (
                    searchResults().map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleTabChange(res.actionTab);
                          setShowSearchResults(false);
                          setGlobalSearchQuery('');
                        }}
                        className="w-full text-right p-2 hover:bg-white/[0.02] rounded-lg flex items-center justify-between text-xs transition duration-150"
                      >
                        <div>
                          <span className="font-bold text-white block">{res.title}</span>
                          <span className="text-[10px] text-gray-500 block mt-0.5">{res.subtitle}</span>
                        </div>
                        <span className="text-[10px] bg-amber-950/20 text-[#D4AF37] px-2 py-0.5 rounded font-bold">{res.type}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-600 font-bold">لا توجد سجلات مطابقة</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Left Part: Quick Clock */}
          <div className="flex items-center gap-4 relative">
            {/* Clock */}
            <span className="text-xs font-mono text-gray-400 font-bold hidden md:inline-flex bg-[#121212] border border-gray-850 px-3 py-1.5 rounded-lg select-none">
              {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </header>

        {/* Dynamic Inner Panel View Stage */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative scroll-smooth">
          {renderActiveView()}
        </main>
      </div>

      {/* Side-Drawer Menu for Mobile/Tablet */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 w-72 bg-[#060606] border-l border-gray-900 z-[70] p-6 flex flex-col justify-between lg:hidden overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-900">
                  <div className="flex items-center gap-2">
                    <img src="/logo.jpg" alt="LYTC Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-sm font-black text-[#E6C587]">ليتك للضيافة</span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 bg-gray-900 rounded-lg text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { label: 'لوحة التحكم', icon: <Building size={14} /> },
                    { label: 'الحجوزات', icon: <Calendar size={14} /> },
                    { label: 'الغرف', icon: <BedDouble size={14} /> },
                    { label: 'المطعم', icon: <Coffee size={14} /> },
                    { label: 'المدفوعات', icon: <CreditCard size={14} /> },
                    { label: 'التحليلات', icon: <BarChart3 size={14} /> },
                    { label: 'التسويق', icon: <Globe size={14} /> },
                    { label: 'تحليلات التسويق', icon: <TrendingUp size={14} /> },
                    { label: 'مركز الذكاء الاصطناعي', icon: <Brain size={14} /> },
                    { label: 'العروض والمزايا', icon: <Sparkles size={14} /> },
                    { label: 'إدارة الموقع', icon: <Globe size={14} /> },
                    { label: 'إدارة السمعة', icon: <Star size={14} /> },
                    { label: 'Google Business', icon: <TrendingUp size={14} /> },
                    { label: 'التقارير', icon: <FileText size={14} /> },
                    { label: 'الإعدادات', icon: <Settings size={14} /> }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleTabChange(item.label as any);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.label
                          ? 'bg-[#D4AF37] text-black shadow-lg'
                          : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-gray-900 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-bold">مرحباً {userRoleDisplay}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition"
                  title="تسجيل الخروج"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* QUICK GLOBAL MODALS (CALLED FROM DASHBOARD CARD CLICKS) */}
      {/* 1. Quick Reservation Modal */}
      {quickBookOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full relative space-y-4 text-xs font-bold">
            <h3 className="text-base font-bold text-[#E6C587]">حجز سريع فوري</h3>
            <div className="space-y-3 text-right">
              <label className="text-gray-400 block">اسم النزيل الثلاثي:</label>
              <input
                type="text"
                id="qb-name"
                className="w-full bg-[#121212] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                placeholder="مثال: الشيخ سليمان آل سعود"
              />
              <label className="text-gray-400 block">رقم الغرفة:</label>
              <input
                type="text"
                id="qb-room"
                className="w-full bg-[#121212] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                placeholder="مثال: 101"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setQuickBookOpen(false)}
                  className="w-1/3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    const elName = document.getElementById('qb-name') as HTMLInputElement;
                    const elRoom = document.getElementById('qb-room') as HTMLSelectElement;
                    if (elName && elName.value && elRoom && elRoom.value) {
                      handleAddReservation({
                        id: `res-${Date.now().toString().slice(-3)}`,
                        guestName: elName.value,
                        roomNumber: elRoom.value,
                        checkIn: '2026-07-05',
                        checkOut: '2026-07-12',
                        status: 'upcoming',
                        amount: 15400,
                        guestId: 'g-quick',
                        adultCount: 2,
                        childrenCount: 0
                      });
                      setQuickBookOpen(false);
                      alert('تم إنشاء وتسجيل الحجز السريع بنجاح!');
                    } else {
                      alert('الرجاء تعبئة الاسم واختيار الغرفة');
                    }
                  }}
                  className="w-2/3 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold rounded-xl"
                >
                  تأكيد الحجز
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Quick Guest Request Modal */}
      {quickRequestOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full relative space-y-4 text-xs font-bold">
            <h3 className="text-base font-bold text-[#E6C587]">تسجيل طلب خدمة نزيل</h3>
            <div className="space-y-3 text-right">
              <label className="text-gray-400 block">رقم الغرفة:</label>
              <input
                type="text"
                id="qr-room"
                className="w-full bg-[#121212] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                placeholder="مثال: 501"
              />
              <label className="text-gray-400 block">تصنيف الخدمة:</label>
              <select
                id="qr-type"
                className="w-full bg-[#121212] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="room_service">خدمة غرف وطعام</option>
                <option value="laundry">مغسلة وكي ملابس</option>
                <option value="housekeeping">خدمات تنظيف</option>
                <option value="spa">حجز سبا ومساج</option>
                <option value="taxi">ليموزين ونقل</option>
              </select>
              <label className="text-gray-400 block">تفاصيل الطلب الدقيقة:</label>
              <textarea
                id="qr-details"
                className="w-full h-20 bg-[#121212] border border-gray-800 rounded-xl p-3 text-white focus:outline-none"
                placeholder="توصيل قهوة عربية بالزعفران وحلويات تمور فاخرة للجناح..."
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setQuickRequestOpen(false)}
                  className="w-1/3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    const elRoom = document.getElementById('qr-room') as HTMLInputElement;
                    const elType = document.getElementById('qr-type') as HTMLSelectElement;
                    const elDetails = document.getElementById('qr-details') as HTMLTextAreaElement;
                    if (elRoom && elRoom.value && elDetails && elDetails.value) {
                      const newReq: ServiceRequest = {
                        id: `req-${Date.now().toString().slice(-3)}`,
                        roomNumber: elRoom.value,
                        type: elType.value as any,
                        details: elDetails.value,
                        status: 'pending',
                        priority: 'medium',
                        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                      };
                      setRequests(prev => [newReq, ...prev]);
                      setQuickRequestOpen(false);
                      alert('تم تسجيل طلب الخدمة للنزيل بنجاح وجاري إعلام الموظف المسؤول!');
                    } else {
                      alert('الرجاء تعبئة رقم الغرفة وتفاصيل الطلب');
                    }
                  }}
                  className="w-2/3 py-2 bg-gradient-to-r from-[#AA7B30] to-[#D4AF37] text-black font-extrabold rounded-xl"
                >
                  تسجيل وإرسال الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
