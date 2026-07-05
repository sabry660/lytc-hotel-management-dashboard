import { Room, Reservation, Guest, ServiceRequest, HousekeepingTask, MaintenanceTicket, RestaurantOrder, Invoice } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'r1',
    number: '501',
    type: 'بنتهاوس فاخر',
    status: 'occupied',
    floor: 5,
    pricePerNight: 4500,
    amenities: ['جاكوزي خاص', 'إطلالة بانورامية على البحر', 'شرفة خاصة', 'خادم شخصي', 'سينما خاصة'],
    guestName: 'الشيخ سلمان آل سعود'
  },
  {
    id: 'r2',
    number: '502',
    type: 'جناح ملكي',
    status: 'occupied',
    floor: 5,
    pricePerNight: 3500,
    amenities: ['مسبح خاص', 'صالون استقبال', 'خادم شخصي', 'غرفة طعام منفصلة'],
    guestName: 'د. فاطمة الهاشم'
  },
  {
    id: 'r3',
    number: '401',
    type: 'جناح ديلوكس',
    status: 'available',
    floor: 4,
    pricePerNight: 2200,
    amenities: ['إطلالة على البحر', 'آلة قهوة إسبراسو', 'حمام رخامي', 'شاشة ذكية 85 بوصة']
  },
  {
    id: 'r4',
    number: '402',
    type: 'جناح ديلوكس',
    status: 'cleaning',
    floor: 4,
    pricePerNight: 2200,
    amenities: ['إطلالة على البحر', 'آلة قهوة إسبراسو', 'حمام رخامي'],
    guestName: 'أحمد الشمري' // Just checked out, needs cleaning
  },
  {
    id: 'r5',
    number: '403',
    type: 'غرفة بريميوم دبل',
    status: 'occupied',
    floor: 4,
    pricePerNight: 1500,
    amenities: ['إطلالة جزئية على البحر', 'مكتب عمل فاخر', 'إنترنت فائق السرعة'],
    guestName: 'م. يوسف القحطاني'
  },
  {
    id: 'r6',
    number: '301',
    type: 'غرفة بريميوم دبل',
    status: 'available',
    floor: 3,
    pricePerNight: 1500,
    amenities: ['إطلالة على الحديقة', 'مكتب عمل فاخر', 'ميني بار مجاني']
  },
  {
    id: 'r7',
    number: '302',
    type: 'غرفة كلاسيك',
    status: 'occupied',
    floor: 3,
    pricePerNight: 950,
    amenities: ['سرير كينغ', 'إنترنت سريع', 'آلة قهوة دائرية'],
    guestName: 'سارة الحربي'
  },
  {
    id: 'r8',
    number: '303',
    type: 'غرفة كلاسيك',
    status: 'maintenance',
    floor: 3,
    pricePerNight: 950,
    amenities: ['سرير كينغ', 'إطلالة داخلية'],
  },
  {
    id: 'r9',
    number: '201',
    type: 'غرفة كلاسيك',
    status: 'available',
    floor: 2,
    pricePerNight: 950,
    amenities: ['سرير كينغ', 'إطلالة داخلية']
  },
  {
    id: 'r10',
    number: '202',
    type: 'غرفة كلاسيك',
    status: 'out_of_service',
    floor: 2,
    pricePerNight: 950,
    amenities: ['سريران منفصلان', 'إطلالة داخلية']
  },
  {
    id: 'r11',
    number: '503',
    type: 'بنتهاوس فاخر',
    status: 'available',
    floor: 5,
    pricePerNight: 4800,
    amenities: ['جاكوزي خارجي', 'إطلالة كاملة على الكورنيش', 'بار قهوة متكامل', 'تلسكوب فلكي']
  },
  {
    id: 'r12',
    number: '404',
    type: 'جناح ديلوكس',
    status: 'occupied',
    floor: 4,
    pricePerNight: 2400,
    amenities: ['إطلالة كاملة على البحر', 'شرفة رخامية ممتدة', 'نظام صوتي محيطي'],
    guestName: 'عبد العزيز العتيبي'
  }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'g1',
    name: 'الشيخ سلمان آل سعود',
    email: 's.alsaud@royal.sa',
    phone: '+966 50 111 2222',
    isVIP: true,
    stayCount: 14,
    notes: 'يفضل الشاي الأخضر العضوي في الصباح الباكر، ودرجة حرارة الجناح دائماً 21 درجة مئوية.',
    nationality: 'سعودي',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'g2',
    name: 'د. فاطمة الهاشم',
    email: 'f.hashem@kfshrc.edu.sa',
    phone: '+966 54 888 7777',
    isVIP: true,
    stayCount: 8,
    notes: 'تطلب وسائد ريش طبيعي إضافية وماء نقي خالٍ من الصوديوم.',
    nationality: 'كويتي',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    id: 'g3',
    name: 'أحمد الشمري',
    email: 'ahmed.shammari@oil.com',
    phone: '+966 53 444 9999',
    isVIP: false,
    stayCount: 3,
    notes: 'يفضل تسجيل المغادرة المتأخر عند الساعة 3 مساءً.',
    nationality: 'سعودي',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'g4',
    name: 'م. يوسف القحطاني',
    email: 'youssef@aramco.com',
    phone: '+966 55 222 3333',
    isVIP: false,
    stayCount: 5,
    notes: 'مهتم بخدمة الليموزين السريعة، يطلب جريدة الصباح اليومية.',
    nationality: 'سعودي',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'g5',
    name: 'سارة الحربي',
    email: 'sara.harbi@giga.sa',
    phone: '+966 56 777 8888',
    isVIP: false,
    stayCount: 2,
    notes: 'تحضر باستمرار جلسات اليوغا الصباحية في السبا الخاص بالفندق.',
    nationality: 'سعودي',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    id: 'g6',
    name: 'عبد العزيز العتيبي',
    email: 'a.otaibi@invest.com',
    phone: '+966 58 999 0000',
    isVIP: true,
    stayCount: 21,
    notes: 'من كبار المستثمرين الشركاء لـ LYTC. يجب توفير طبق ترحيبي فاخر من الفواكه والتمور المحشوة باللوز عند كل وصول.',
    nationality: 'سعودي',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    id: 'g7',
    name: 'نورة السديري',
    email: 'noura.s@culture.gov.sa',
    phone: '+966 59 333 4444',
    isVIP: true,
    stayCount: 11,
    notes: 'تفضل الأجنحة في الطوابق العليا البعيدة عن المصاعد لضمان أقصى درجات الهدوء.',
    nationality: 'سعودي',
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a131ffd103fd?w=150'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    guestName: 'الشيخ سلمان آل سعود',
    roomNumber: '501',
    checkIn: '2026-07-01',
    checkOut: '2026-07-10',
    status: 'checked_in',
    amount: 40500,
    guestId: 'g1',
    adultCount: 2,
    childrenCount: 1
  },
  {
    id: 'res-102',
    guestName: 'د. فاطمة الهاشم',
    roomNumber: '502',
    checkIn: '2026-07-03',
    checkOut: '2026-07-08',
    status: 'checked_in',
    amount: 17500,
    guestId: 'g2',
    adultCount: 1,
    childrenCount: 0
  },
  {
    id: 'res-103',
    guestName: 'أحمد الشمري',
    roomNumber: '402',
    checkIn: '2026-06-28',
    checkOut: '2026-07-05',
    status: 'checked_out',
    amount: 15400,
    guestId: 'g3',
    adultCount: 2,
    childrenCount: 2
  },
  {
    id: 'res-104',
    guestName: 'م. يوسف القحطاني',
    roomNumber: '403',
    checkIn: '2026-07-04',
    checkOut: '2026-07-12',
    status: 'checked_in',
    amount: 12000,
    guestId: 'g4',
    adultCount: 1,
    childrenCount: 0
  },
  {
    id: 'res-105',
    guestName: 'سارة الحربي',
    roomNumber: '302',
    checkIn: '2026-07-04',
    checkOut: '2026-07-07',
    status: 'checked_in',
    amount: 2850,
    guestId: 'g5',
    adultCount: 1,
    childrenCount: 0
  },
  {
    id: 'res-106',
    guestName: 'عبد العزيز العتيبي',
    roomNumber: '404',
    checkIn: '2026-07-05',
    checkOut: '2026-07-15',
    status: 'checked_in',
    amount: 24000,
    guestId: 'g6',
    adultCount: 2,
    childrenCount: 0
  },
  {
    id: 'res-107',
    guestName: 'نورة السديري',
    roomNumber: '401',
    checkIn: '2026-07-06',
    checkOut: '2026-07-11',
    status: 'upcoming',
    amount: 11000,
    guestId: 'g7',
    adultCount: 1,
    childrenCount: 0
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    roomNumber: '501',
    type: 'room_service',
    details: 'وجبة غداء فاخرة: كبسة دجاج لثلاثة أشخاص مع عصير رمان طبيعي طازج وسلطة جرجير.',
    status: 'assigned',
    priority: 'high',
    assignee: 'مروان العمودي (المطبخ)',
    timestamp: '11:15'
  },
  {
    id: 'req-2',
    roomNumber: '502',
    type: 'spa',
    details: 'طلب حجز جلسة تدليك بالزيوت العطرية السويدية في الجناح الخاص عند الساعة 5 مساءً.',
    status: 'pending',
    priority: 'medium',
    assignee: 'أمل السعدون (السبا)',
    timestamp: '11:00'
  },
  {
    id: 'req-3',
    roomNumber: '403',
    type: 'laundry',
    details: 'كي بدلة رسمية سوداء وفستان سهرة حريري وتسليمهما قبل الساعة 6 مساءً للضرورة.',
    status: 'pending',
    priority: 'high',
    assignee: 'محمد نجيب (المغسلة)',
    timestamp: '10:45'
  },
  {
    id: 'req-4',
    roomNumber: '302',
    type: 'housekeeping',
    details: 'تنظيف الجناح بالكامل وتزويد الحمام بمناشف قطنية جديدة ومستلزمات نظافة فرنسية إضافية.',
    status: 'completed',
    priority: 'medium',
    assignee: 'محمد نجيب (الخدمات)',
    timestamp: '09:30'
  },
  {
    id: 'req-5',
    roomNumber: '501',
    type: 'taxi',
    details: 'سيارة ليموزين فاخرة رولز رويس للتنقل إلى مطار الملك خالد الدولي الساعة 2:30 ظهراً.',
    status: 'assigned',
    priority: 'high',
    assignee: 'عمر الشريف (السيارات)',
    timestamp: '11:20'
  },
  {
    id: 'req-6',
    roomNumber: '303',
    type: 'maintenance',
    details: 'صيانة مكيف الغرفة، يوجد صوت ضوضاء طفيف عند التشغيل على وضع التبريد الفائق.',
    status: 'assigned',
    priority: 'medium',
    assignee: 'زياد الشهري (الصيانة)',
    timestamp: '10:15'
  }
];

export const INITIAL_HOUSEKEEPING: HousekeepingTask[] = [
  {
    id: 'hk-1',
    roomNumber: '402',
    status: 'cleaning',
    assignee: 'محمد نجيب',
    priority: 'high',
    lastCleaned: 'أمس 04:00 م'
  },
  {
    id: 'hk-2',
    roomNumber: '301',
    status: 'completed',
    assignee: 'سعيد عبد الله',
    priority: 'low',
    lastCleaned: 'اليوم 09:15 ص'
  },
  {
    id: 'hk-3',
    roomNumber: '201',
    status: 'completed',
    assignee: 'سعيد عبد الله',
    priority: 'low',
    lastCleaned: 'اليوم 08:30 ص'
  },
  {
    id: 'hk-4',
    roomNumber: '503',
    status: 'pending',
    assignee: 'محمد نجيب',
    priority: 'medium',
    lastCleaned: 'منذ يومين'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceTicket[] = [
  {
    id: 'maint-1',
    roomNumber: '303',
    issue: 'صوت ضوضاء طفيف في المكيف الداخلي للغرفة',
    priority: 'medium',
    status: 'assigned',
    technician: 'زياد الشهري',
    dateCreated: '2026-07-05 10:15'
  },
  {
    id: 'maint-2',
    roomNumber: '202',
    issue: 'خلل في لوحة التحكم الرقمية للإضاءة الذكية والستائر',
    priority: 'high',
    status: 'open',
    technician: 'أحمد الحربي',
    dateCreated: '2026-07-05 08:00'
  },
  {
    id: 'maint-3',
    roomNumber: '104',
    issue: 'تسريب مياه غير مرئي أسفل حوض الاستحمام الرخامي بجناح 104',
    priority: 'high',
    status: 'completed',
    technician: 'زياد الشهري',
    dateCreated: '2026-07-04 14:20'
  }
];

export const INITIAL_RESTAURANT: RestaurantOrder[] = [
  {
    id: 'rest-1',
    tableNumber: 'الطاولة الملكية 1',
    items: ['ستيك فيليه بالذهب عيار 24 قيراط', 'سلطة الكينوا العضوية', 'مشروب ليمون ونعناع فوار'],
    status: 'preparing',
    total: 1250,
    time: '11:10'
  },
  {
    id: 'rest-2',
    tableNumber: 'طاولة البحر 4',
    items: ['طبق ثمار البحر المشكلة الفاخر', 'شوربة كابوريا بالكريمة', 'شاي مثلج بالزعفران'],
    status: 'ordered',
    total: 850,
    time: '11:22'
  },
  {
    id: 'rest-3',
    tableNumber: 'الجناح 501',
    items: ['حساء العدس بالكمون الشامي', 'مشاوي مشكلة ليتك المميزة', 'مياه إيفيان مبردة'],
    status: 'delivered',
    total: 450,
    time: '10:05'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    guestName: 'الشيخ سلمان آل سعود',
    roomNumber: '501',
    amount: 40500,
    status: 'paid',
    date: '2026-07-01',
    method: 'بوابة دفع إلكترونية'
  },
  {
    id: 'inv-1002',
    guestName: 'أحمد الشمري',
    roomNumber: '402',
    amount: 15400,
    status: 'paid',
    date: '2026-07-05',
    method: 'بطاقة ائتمان'
  },
  {
    id: 'inv-1003',
    guestName: 'د. فاطمة الهاشم',
    roomNumber: '502',
    amount: 17500,
    status: 'unpaid',
    date: '2026-07-03',
    method: 'تحويل بنكي'
  },
  {
    id: 'inv-1004',
    guestName: 'م. يوسف القحطاني',
    roomNumber: '403',
    amount: 12000,
    status: 'paid',
    date: '2026-07-04',
    method: 'بوابة دفع إلكترونية'
  }
];

export const HOTEL_INFO = {
  name: 'قصر ليتك الفاخر للضيافة | LYTC Luxury Palace Resort',
  address: 'حي الهدا، الرياض، المملكة العربية السعودية',
  rating: '5 نجوم بلاتيني',
  manager: 'عبد الله بن خالد آل عبد الرحمن',
  capacity: '120 وحدة سكنية (أجنحة وبنتهاوس وفلل)',
  phone: '+966 11 888 9999',
  email: 'royal@lytc-palace.com',
  website: 'https://lytc-palace.com'
};
