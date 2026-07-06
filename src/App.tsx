import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Bell, Search, User, LogOut, Sparkles, Clock, Menu, X, Check, CheckCircle2,
  Calendar, BedDouble, Users, MessageSquare, Wrench, Coffee, CreditCard, BarChart3, Globe, Settings, Award, TrendingUp, Brain, Star, FileText
} from 'lucide-react';

import Login from './components/Login';
import DashboardHome from './components/DashboardHome';
import RoomsSection from './components/RoomsSection';
import ReservationsSection from './components/ReservationsSection';
import GuestsSection from './components/GuestsSection';
import GuestCRMSection from './components/GuestCRMSection';
import RequestsSection from './components/RequestsSection';
import HousekeepingSection from './components/HousekeepingSection';
import MaintenanceSection from './components/MaintenanceSection';
import RestaurantSection from './components/RestaurantSection';
import PaymentsSection from './components/PaymentsSection';
import AnalyticsSection from './components/AnalyticsSection';
import MarketingSection from './components/MarketingSection';
import MarketingAnalyticsSection from './components/MarketingAnalyticsSection';
import AICenterSection from './components/AICenterSection';
import StaffSection from './components/StaffSection';
import WebsiteCMS from './components/WebsiteCMS';
import ReputationSection from './components/ReputationSection';
import GoogleBusinessSection from './components/GoogleBusinessSection';
import ReportsSection from './components/ReportsSection';
import SettingsSection from './components/SettingsSection';

import { 
  INITIAL_ROOMS, 
  INITIAL_GUESTS, 
  INITIAL_RESERVATIONS, 
  INITIAL_REQUESTS, 
  INITIAL_HOUSEKEEPING, 
  INITIAL_MAINTENANCE, 
  INITIAL_RESTAURANT, 
  INITIAL_INVOICES, 
  HOTEL_INFO 
} from './data';
import { Room, Reservation, Guest, ServiceRequest, HousekeepingTask, MaintenanceTicket, RestaurantOrder, Invoice, Staff } from './types';

export default function App() {
  // Authentication & Loading States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('lytc_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('lytc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active view tab state
  const [activeTab, setActiveTab] = useState<'لوحة التحكم' | 'الحجوزات' | 'الغرف' | 'النزلاء' | 'طلبات النزلاء' | 'خدمة الغرف' | 'المطعم' | 'الصيانة' | 'المدفوعات' | 'التحليلات' | 'التسويق' | 'الموظفين' | 'إدارة الموقع' | 'إدارة السمعة' | 'Google Business' | 'التقارير' | 'الإعدادات'>('لوحة التحكم');

  // Core Entity States
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('lytc_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('lytc_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('lytc_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('lytc_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('lytc_housekeeping');
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING;
  });
  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('lytc_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });
  const [orders, setOrders] = useState<RestaurantOrder[]>(() => {
    const saved = localStorage.getItem('lytc_orders');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('lytc_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('lytc_staff');
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
    localStorage.setItem('lytc_rooms', JSON.stringify(rooms));
  }, [rooms]);
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
  useEffect(() => {
    localStorage.setItem('lytc_staff', JSON.stringify(staff));
  }, [staff]);

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
  const handleUpdateRoomStatus = (roomId: string, status: Room['status']) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    
    // Add real-time event notice
    const roomNo = rooms.find(r => r.id === roomId)?.number;
    const labels: Record<Room['status'], string> = {
      available: 'متاحاً', occupied: 'مشغولاً بالنزلاء', cleaning: 'تحت النظافة والتعقيم',
      maintenance: 'تحت الصيانة الفنية', out_of_service: 'خارج الخدمة الفندقية'
    };
    
    setNotifications(prev => [
      { id: Date.now().toString(), title: `تعديل حالة الجناح ${roomNo} ليصبح ${labels[status]} الآن`, time: 'الآن', read: false },
      ...prev
    ]);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    
    // Add real-time event notice
    const labels: Record<Room['status'], string> = {
      available: 'متاحاً', occupied: 'مشغولاً بالنزلاء', cleaning: 'تحت النظافة والتعقيم',
      maintenance: 'تحت الصيانة الفنية', out_of_service: 'خارج الخدمة الفندقية'
    };
    
    setNotifications(prev => [
      { id: Date.now().toString(), title: `تم تحديث معلومات الجناح ${updatedRoom.number}`, time: 'الآن', read: false },
      ...prev
    ]);
  };

  const handleAddReservation = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
    
    // Autooccupy assigned room
    setRooms(prev => prev.map(r => r.number === newRes.roomNumber ? { ...r, status: 'occupied', guestName: newRes.guestName } : r));

    // Auto-create invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      guestName: newRes.guestName,
      roomNumber: newRes.roomNumber,
      amount: newRes.amount,
      status: 'unpaid',
      date: new Date().toISOString().split('T')[0],
      method: 'بوابة دفع إلكترونية'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    setNotifications(prev => [
      { id: Date.now().toString(), title: `حجز مؤكد وجديد باسم ${newRes.guestName} للجناح ${newRes.roomNumber}`, time: 'الآن', read: false },
      ...prev
    ]);
  };

  const handleUpdateReservationStatus = (resId: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(res => res.id === resId ? { ...res, status } : res));
    const targetRes = reservations.find(r => r.id === resId);
    if (!targetRes) return;

    if (status === 'checked_in') {
      setRooms(prev => prev.map(r => r.number === targetRes.roomNumber ? { ...r, status: 'occupied', guestName: targetRes.guestName } : r));
    } else if (status === 'checked_out') {
      setRooms(prev => prev.map(r => r.number === targetRes.roomNumber ? { ...r, status: 'cleaning', guestName: undefined } : r));
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
    } else if (status === 'cancelled') {
      setRooms(prev => prev.map(r => r.number === targetRes.roomNumber ? { ...r, status: 'available', guestName: undefined } : r));
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
    const taskObj = housekeeping.find(t => t.id === taskId);
    if (taskObj && status === 'completed') {
      // Change target room to available
      setRooms(prev => prev.map(r => r.number === taskObj.roomNumber ? { ...r, status: 'available' } : r));
    }
  };

  const handleUpdateTicketStatus = (ticketId: string, status: MaintenanceTicket['status']) => {
    setMaintenance(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    const ticketObj = maintenance.find(t => t.id === ticketId);
    if (ticketObj && status === 'completed') {
      setRooms(prev => prev.map(r => r.number === ticketObj.roomNumber ? { ...r, status: 'available' } : r));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: RestaurantOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdateInvoiceStatus = (invId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status } : inv));
  };

  const handleUpdateStaffStatus = (staffId: string, status: Staff['status']) => {
    setStaff(prev => prev.map(person => person.id === staffId ? { ...person, status } : person));
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

    // Search rooms
    rooms.forEach(r => {
      if (r.number.includes(lower)) {
        results.push({ type: 'غرفة', title: `جناح رقم ${r.number}`, subtitle: r.type, actionTab: 'الغرف' });
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
            rooms={rooms}
            reservations={reservations}
            guests={guests}
            requests={requests}
            housekeeping={housekeeping}
            maintenance={maintenance}
            invoices={invoices}
            onNavigate={(tab) => setActiveTab(tab as any)}
            onOpenQuickBook={() => setQuickBookOpen(true)}
            onOpenQuickRequest={() => setQuickRequestOpen(true)}
          />
        );
      case 'الغرف':
        return <RoomsSection rooms={rooms} onUpdateRoomStatus={handleUpdateRoomStatus} onUpdateRoom={handleUpdateRoom} />;
      case 'الحجوزات':
        return (
          <ReservationsSection
            reservations={reservations}
            rooms={rooms}
            guests={guests}
            onAddReservation={handleAddReservation}
            onUpdateReservationStatus={handleUpdateReservationStatus}
          />
        );
      case 'النزلاء':
        return <GuestsSection guests={guests} reservations={reservations} />;
      case 'إدارة الضيوف':
        return <GuestCRMSection guests={guests} />;
      case 'طلبات النزلاء':
        return (
          <RequestsSection
            requests={requests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onAssignRequest={handleAssignRequest}
          />
        );
      case 'خدمة الغرف':
        return <HousekeepingSection tasks={housekeeping} onUpdateTaskStatus={handleUpdateTaskStatus} />;
      case 'المطعم':
        return <RestaurantSection orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
      case 'الصيانة':
        return <MaintenanceSection tickets={maintenance} onUpdateTicketStatus={handleUpdateTicketStatus} />;
      case 'المدفوعات':
        return <PaymentsSection invoices={invoices} onUpdateInvoiceStatus={handleUpdateInvoiceStatus} />;
      case 'التحليلات':
        return <AnalyticsSection />;
      case 'التسويق':
        return <MarketingSection />;
      case 'تحليلات التسويق':
        return <MarketingAnalyticsSection />;
      case 'مركز الذكاء الاصطناعي':
        return <AICenterSection />;
      case 'الموظفين':
        return <StaffSection staff={staff} onUpdateStaffStatus={handleUpdateStaffStatus} />;
      case 'إدارة الموقع':
        return <WebsiteCMS />;
      case 'إدارة السمعة':
        return <ReputationSection />;
      case 'Google Business':
        return <GoogleBusinessSection />;
      case 'التقارير':
        return <ReportsSection />;
      case 'الإعدادات':
        return <SettingsSection />;
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
            { label: 'إدارة الضيوف', icon: <Users size={16} /> },
            { label: 'طلبات النزلاء', icon: <MessageSquare size={16} /> },
            { label: 'خدمة الغرف', icon: <Sparkles size={16} /> },
            { label: 'المطعم', icon: <Coffee size={16} /> },
            { label: 'الصيانة', icon: <Wrench size={16} /> },
            { label: 'المدفوعات', icon: <CreditCard size={16} /> },
            { label: 'التحليلات', icon: <BarChart3 size={16} /> },
            { label: 'التسويق', icon: <Globe size={16} /> },
            { label: 'تحليلات التسويق', icon: <TrendingUp size={16} /> },
            { label: 'مركز الذكاء الاصطناعي', icon: <Brain size={16} /> },
            { label: 'الموظفين', icon: <Award size={16} /> },
            { label: 'إدارة الموقع', icon: <Globe size={16} /> },
            { label: 'إدارة السمعة', icon: <Star size={16} /> },
            { label: 'Google Business', icon: <TrendingUp size={16} /> },
            { label: 'التقارير', icon: <FileText size={16} /> },
            { label: 'الإعدادات', icon: <Settings size={16} /> }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label as any)}
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 bg-[#121212] flex items-center justify-center font-bold text-[#E6C587]">
              ع
            </div>
            <div>
              <span className="text-gray-300 font-bold block">الشيخ عبد الله</span>
              <span className="text-[10px] text-gray-500 block">المدير العام</span>
            </div>
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
                          setActiveTab(res.actionTab);
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

          {/* Left Part: Notifications, Quick Clock, User info */}
          <div className="flex items-center gap-4 relative">
            
            {/* Clock */}
            <span className="text-xs font-mono text-gray-400 font-bold hidden md:inline-flex bg-[#121212] border border-gray-850 px-3 py-1.5 rounded-lg select-none">
              الرياض • 5 يوليو
            </span>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-[#121212] hover:bg-[#1a1a1a] border border-gray-800 rounded-xl text-gray-300 hover:text-white transition relative"
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#121212]" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-3 w-80 bg-[#0b0b0b] border border-gray-800 rounded-xl shadow-2xl p-4 space-y-3 z-50 text-right"
                  >
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span className="text-xs font-bold text-white">مركز التنبيهات المباشر</span>
                      <button
                        onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        }}
                        className="text-[10px] text-[#D4AF37] hover:underline"
                      >
                        قراءة الكل
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-2.5 rounded-lg text-xs transition duration-150 ${n.read ? 'bg-transparent text-gray-500' : 'bg-white/[0.02] text-gray-200'}`}>
                          <div className="font-bold">{n.title}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-1 flex justify-between items-center">
                            <span>{n.time}</span>
                            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Group Profile Badge */}
            <div className="flex items-center gap-2 bg-[#121212] border border-gray-800 p-1.5 pr-3 rounded-xl select-none">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-white block">الشيخ عبد الله</span>
                <span className="text-[9px] text-[#D4AF37] block mt-0.5">المدير العام للمجموعة</span>
              </div>
              <div className="w-8 h-8 rounded-lg border border-[#D4AF37]/30 bg-[#1d1d1d] flex items-center justify-center font-bold text-[#E6C587]">
                ع
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel View Stage */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
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
              className="fixed inset-y-0 right-0 w-72 bg-[#060606] border-l border-gray-900 z-[70] p-6 flex flex-col justify-between lg:hidden"
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
                    { label: 'النزلاء', icon: <Users size={14} /> },
                    { label: 'طلبات النزلاء', icon: <MessageSquare size={14} /> },
                    { label: 'خدمة الغرف', icon: <Sparkles size={14} /> },
                    { label: 'المطعم', icon: <Coffee size={14} /> },
                    { label: 'الصيانة', icon: <Wrench size={14} /> },
                    { label: 'المدفوعات', icon: <CreditCard size={14} /> },
                    { label: 'التحليلات', icon: <BarChart3 size={14} /> },
                    { label: 'التسويق', icon: <Globe size={14} /> },
                    { label: 'الموظفين', icon: <Award size={14} /> },
                    { label: 'إدارة الموقع', icon: <Globe size={14} /> },
                    { label: 'إدارة السمعة', icon: <Star size={14} /> },
                    { label: 'Google Business', icon: <TrendingUp size={14} /> },
                    { label: 'التقارير', icon: <FileText size={14} /> },
                    { label: 'الإعدادات', icon: <Settings size={14} /> }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveTab(item.label as any);
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
                <span className="text-xs text-gray-400 font-bold">الشيخ عبد الله</span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-red-950/20 text-red-400 rounded-lg"
                >
                  <LogOut size={14} />
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
              <label className="text-gray-400 block">اختر الغرفة:</label>
              <select
                id="qb-room"
                className="w-full bg-[#121212] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                {rooms.filter(r => r.status === 'available').map(room => (
                  <option key={room.id} value={room.number}>
                    جناح {room.number} ({room.pricePerNight} ريال)
                  </option>
                ))}
              </select>
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
