import { Room, Reservation, Guest, ServiceRequest, HousekeepingTask, MaintenanceTicket, RestaurantOrder, Invoice, Staff } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'r1',
    number: '501',
    name: 'بنتهاوس الخليج الملكي',
    description: 'أرقى بنتهاوس في الفندق مع إطلالة بانورامية ساحرة على الخليج العربي، مصمم لاستقبال كبار الشخصيات والعائلات الملكية.',
    type: 'بنتهاوس فاخر',
    status: 'occupied',
    floor: 5,
    pricePerNight: 4500,
    capacity: 4,
    amenities: ['جاكوزي خاص', 'إطلالة بانورامية على البحر', 'شرفة خاصة', 'خادم شخصي', 'سينما خاصة'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    guestName: 'الشيخ سلمان آل سعود',
    lastUpdated: '2026-07-05 14:30',
    occupancyRate: 92
  },
  {
    id: 'r2',
    number: '502',
    name: 'جناح النخبة الملكي',
    description: 'جناح ملكي فاخر بمسبح خاص وصالون استقبال راقي، مثالي للضيوف الذين يبحثون عن الخصوصية التامة والرفاهية.',
    type: 'جناح ملكي',
    status: 'occupied',
    floor: 5,
    pricePerNight: 3500,
    capacity: 3,
    amenities: ['مسبح خاص', 'صالون استقبال', 'خادم شخصي', 'غرفة طعام منفصلة'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
    guestName: 'د. فاطمة الهاشم',
    lastUpdated: '2026-07-05 12:15',
    occupancyRate: 88,
    maintenanceLog: [
      { date: '2026-06-15', issue: 'صيانة نظام التكييف', technician: 'محمد العتيبي', cost: 1200, status: 'completed' },
      { date: '2026-05-20', issue: 'إصلاح المسبح', technician: 'أحمد الشمري', cost: 3500, status: 'completed' }
    ],
    cleaningLog: [
      { date: '2026-07-05', staff: 'فاطمة الحربي', duration: 45, quality: 5 },
      { date: '2026-07-04', staff: 'سارة العتيبي', duration: 50, quality: 4 }
    ],
    roomRevenue: 285000
  },
  {
    id: 'r3',
    number: '401',
    name: 'جناح ديلوكس البحري',
    description: 'جناح ديلوكس أنيق مع إطلالة مباشرة على البحر ومرافق عصرية متكاملة.',
    type: 'جناح ديلوكس',
    status: 'available',
    floor: 4,
    pricePerNight: 2200,
    capacity: 2,
    amenities: ['إطلالة على البحر', 'آلة قهوة إسبراسو', 'حمام رخامي', 'شاشة ذكية 85 بوصة'],
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
    lastUpdated: '2026-07-05 10:00',
    occupancyRate: 75,
    maintenanceLog: [
      { date: '2026-06-10', issue: 'استبدال مراوح السقف', technician: 'خالد الغامدي', cost: 450, status: 'completed' }
    ],
    cleaningLog: [
      { date: '2026-07-04', staff: 'منى القحطاني', duration: 35, quality: 5 },
      { date: '2026-07-02', staff: 'عائشة الشمري', duration: 40, quality: 4 }
    ],
    roomRevenue: 156000
  },
  {
    id: 'r4',
    number: '402',
    name: 'جناح ديلوكس الكلاسيكي',
    description: 'جناح ديلوكس كلاسيكي بتصميم عصري أنيق، مثالي للأزواج ورحلات العمل.',
    type: 'جناح ديلوكس',
    status: 'cleaning',
    floor: 4,
    pricePerNight: 2200,
    capacity: 2,
    amenities: ['إطلالة على البحر', 'آلة قهوة إسبراسو', 'حمام رخامي'],
    images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'],
    guestName: 'أحمد الشمري',
    lastUpdated: '2026-07-05 09:45',
    occupancyRate: 82,
    maintenanceLog: [
      { date: '2026-06-25', issue: 'إصلاح قفل الباب', technician: 'عبدالله العتيبي', cost: 280, status: 'completed' }
    ],
    cleaningLog: [
      { date: '2026-07-05', staff: 'نورة الشمري', duration: 38, quality: 5 },
      { date: '2026-07-03', staff: 'سارة الحربي', duration: 42, quality: 4 }
    ],
    roomRevenue: 142000
  },
  {
    id: 'r5',
    number: '403',
    name: 'جناح بريميوم الأعمال',
    description: 'جناح بريميوم مخصص لرجال الأعمال مع مكتب عمل متطور وإنترنت فائق السرعة.',
    type: 'غرفة بريميوم دبل',
    status: 'occupied',
    floor: 4,
    pricePerNight: 1500,
    capacity: 2,
    amenities: ['إطلالة جزئية على البحر', 'مكتب عمل فاخر', 'إنترنت فائق السرعة'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
    guestName: 'م. يوسف القحطاني',
    lastUpdated: '2026-07-05 11:20',
    occupancyRate: 79,
    maintenanceLog: [
      { date: '2026-06-18', issue: 'ترقية الإنترنت', technician: 'فريق تقنية المعلومات', cost: 800, status: 'completed' }
    ],
    cleaningLog: [
      { date: '2026-07-04', staff: 'هند الشمري', duration: 30, quality: 5 },
      { date: '2026-07-01', staff: 'مريم العتيبي', duration: 35, quality: 4 }
    ],
    roomRevenue: 98000
  },
  {
    id: 'r6',
    number: '301',
    name: 'جناح بريميوم الحديقة',
    description: 'جناح بريميوم هادئ مع إطلالة على الحدائق الخلابة ومكتب عمل مريح.',
    type: 'غرفة بريميوم دبل',
    status: 'available',
    floor: 3,
    pricePerNight: 1500,
    capacity: 2,
    amenities: ['إطلالة على الحديقة', 'مكتب عمل فاخر', 'ميني بار مجاني'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    lastUpdated: '2026-07-05 08:30',
    occupancyRate: 71,
    maintenanceLog: [],
    cleaningLog: [
      { date: '2026-07-03', staff: 'فاطمة القحطاني', duration: 32, quality: 5 },
      { date: '2026-06-30', staff: 'نورة الغامدي', duration: 38, quality: 4 }
    ],
    roomRevenue: 89000
  },
  {
    id: 'r7',
    number: '302',
    name: 'غرفة كلاسيك المريحة',
    description: 'غرفة كلاسيك مريحة بتصميم عصري ومرافق أساسية متميزة.',
    type: 'غرفة كلاسيك',
    status: 'occupied',
    floor: 3,
    pricePerNight: 950,
    capacity: 2,
    amenities: ['سرير كينغ', 'إنترنت سريع', 'آلة قهوة دائرية'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    guestName: 'سارة الحربي',
    lastUpdated: '2026-07-05 13:00',
    occupancyRate: 85,
    maintenanceLog: [
      { date: '2026-06-12', issue: 'إصلاح التلفزيون', technician: 'فريق الصيانة', cost: 350, status: 'completed' }
    ],
    cleaningLog: [
      { date: '2026-07-04', staff: 'عائشة العتيبي', duration: 25, quality: 5 },
      { date: '2026-07-01', staff: 'منى الشمري', duration: 28, quality: 4 }
    ],
    roomRevenue: 67000
  },
  {
    id: 'r8',
    number: '303',
    name: 'غرفة كلاسيك الداخلية',
    description: 'غرفة كلاسيك اقتصادية بإطلالة داخلية هادئة ومناسبة للميزانية.',
    type: 'غرفة كلاسيك',
    status: 'maintenance',
    floor: 3,
    pricePerNight: 950,
    capacity: 2,
    amenities: ['سرير كينغ', 'إطلالة داخلية'],
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
    lastUpdated: '2026-07-04 16:00',
    occupancyRate: 68
  },
  {
    id: 'r9',
    number: '201',
    name: 'غرفة كلاسيك الاقتصادية',
    description: 'غرفة كلاسيك اقتصادية بتصميم بسيط وأنيق.',
    type: 'غرفة كلاسيك',
    status: 'available',
    floor: 2,
    pricePerNight: 950,
    capacity: 2,
    amenities: ['سرير كينغ', 'إطلالة داخلية'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    lastUpdated: '2026-07-05 07:00',
    occupancyRate: 73
  },
  {
    id: 'r10',
    number: '202',
    name: 'غرفة كلاسيك التوأم',
    description: 'غرفة كلاسيك بسريرين منفصلين، مناسبة للأصدقاء أو الزملاء.',
    type: 'غرفة كلاسيك',
    status: 'out_of_service',
    floor: 2,
    pricePerNight: 950,
    capacity: 2,
    amenities: ['سريران منفصلان', 'إطلالة داخلية'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    lastUpdated: '2026-07-03 18:00',
    occupancyRate: 65
  },
  {
    id: 'r11',
    number: '503',
    name: 'بنتهاوس الكورنيش الملكي',
    description: 'بنتهاوس فاخر مع إطلالة كاملة على الكورنيش وجاكوزي خارجي وبار قهوة متكامل.',
    type: 'بنتهاوس فاخر',
    status: 'available',
    floor: 5,
    pricePerNight: 4800,
    capacity: 4,
    amenities: ['جاكوزي خارجي', 'إطلالة كاملة على الكورنيش', 'بار قهوة متكامل', 'تلسكوب فلكي'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    lastUpdated: '2026-07-05 09:00',
    occupancyRate: 95
  },
  {
    id: 'r12',
    number: '404',
    name: 'جناح ديلوكس الشاطئي',
    description: 'جناح ديلوكس مع إطلالة كاملة على البحر وشرفة رخامية ممتدة ونظام صوتي محيطي.',
    type: 'جناح ديلوكس',
    status: 'occupied',
    floor: 4,
    pricePerNight: 2400,
    capacity: 3,
    amenities: ['إطلالة كاملة على البحر', 'شرفة رخامية ممتدة', 'نظام صوتي محيطي'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    guestName: 'عبد العزيز العتيبي',
    lastUpdated: '2026-07-05 14:00',
    occupancyRate: 90
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
    language: 'العربية',
    passportNumber: 'A12345678',
    dateOfBirth: '1975-03-15',
    anniversaryDate: '2000-06-20',
    previousStays: [
      { checkIn: '2026-01-10', checkOut: '2026-01-15', roomNumber: '501', amount: 22500 },
      { checkIn: '2025-09-05', checkOut: '2025-09-12', roomNumber: '502', amount: 28000 },
      { checkIn: '2025-04-20', checkOut: '2025-04-25', roomNumber: '501', amount: 22500 }
    ],
    totalSpending: 485000,
    preferredRoom: 'بنتهاوس فاخر',
    pillowPreference: 'ريش طبيعي',
    favoriteFoods: ['الشاي الأخضر', 'المأكولات البحرية', 'الفواكه الطازجة'],
    foodAllergies: [],
    roomPreferences: ['طابق علوي', 'إطلالة على البحر', 'جناح واسع'],
    visitReason: 'أعمال ورسمية',
    childrenCount: 0,
    loyaltyPoints: 15000,
    marketingConsent: true,
    lastEmailOpen: '2026-07-04',
    lifetimeValue: 485000,
    referralSource: 'direct',
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
    language: 'العربية',
    passportNumber: 'K87654321',
    dateOfBirth: '1982-08-22',
    previousStays: [
      { checkIn: '2026-06-01', checkOut: '2026-06-08', roomNumber: '502', amount: 24500 },
      { checkIn: '2025-11-15', checkOut: '2025-11-20', roomNumber: '501', amount: 22500 }
    ],
    totalSpending: 195000,
    preferredRoom: 'جناح ملكي',
    pillowPreference: 'ريش طبيعي',
    favoriteFoods: ['السلطات الصحية', 'العصائر الطازجة'],
    foodAllergies: ['المكسرات', 'الجلوتين'],
    roomPreferences: ['هدوء تام', 'خدمة غرف 24/7'],
    visitReason: 'طبية',
    childrenCount: 0,
    loyaltyPoints: 8500,
    marketingConsent: false,
    lifetimeValue: 195000,
    referralSource: 'booking.com',
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
    language: 'العربية',
    passportNumber: 'S11223344',
    dateOfBirth: '1988-12-10',
    previousStays: [
      { checkIn: '2026-05-20', checkOut: '2026-05-23', roomNumber: '402', amount: 6600 }
    ],
    totalSpending: 18500,
    preferredRoom: 'جناح ديلوكس',
    pillowPreference: 'إسفنج عالي الجودة',
    favoriteFoods: ['الشواء العربي', 'القهوة العربية'],
    foodAllergies: [],
    roomPreferences: ['إنترنت سريع', 'مكتب عمل'],
    visitReason: 'أعمال',
    childrenCount: 0,
    loyaltyPoints: 1200,
    marketingConsent: true,
    lifetimeValue: 18500,
    referralSource: 'direct',
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
    language: 'العربية',
    passportNumber: 'S55667788',
    dateOfBirth: '1985-04-18',
    previousStays: [
      { checkIn: '2026-04-10', checkOut: '2026-04-15', roomNumber: '403', amount: 7500 },
      { checkIn: '2025-10-05', checkOut: '2025-10-10', roomNumber: '401', amount: 11000 }
    ],
    totalSpending: 42000,
    preferredRoom: 'غرفة بريميوم دبل',
    pillowPreference: 'عادي',
    favoriteFoods: ['الإفطار العربي', 'المشروبات الساخنة'],
    foodAllergies: [],
    roomPreferences: ['قرب المصعد', 'خدمة صحية سريعة'],
    visitReason: 'أعمال',
    childrenCount: 2,
    loyaltyPoints: 3500,
    marketingConsent: true,
    lifetimeValue: 42000,
    referralSource: 'corporate',
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
    language: 'العربية',
    passportNumber: 'S99887766',
    dateOfBirth: '1992-07-25',
    previousStays: [
      { checkIn: '2026-06-15', checkOut: '2026-06-18', roomNumber: '303', amount: 2850 }
    ],
    totalSpending: 8500,
    preferredRoom: 'غرفة كلاسيك',
    pillowPreference: 'إسفنج ناعم',
    favoriteFoods: ['السلطات', 'العصائر الطبيعية'],
    foodAllergies: ['اللاكتوز'],
    roomPreferences: ['قرب السبا', 'هدوء'],
    visitReason: 'ترفيه',
    childrenCount: 0,
    loyaltyPoints: 800,
    marketingConsent: true,
    lifetimeValue: 8500,
    referralSource: 'instagram',
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
    items: [
      { name: 'ستيك فيليه بالذهب عيار 24 قيراط', quantity: 1, price: 650 },
      { name: 'سلطة الكينوا العضوية', quantity: 1, price: 180 },
      { name: 'مشروب ليمون ونعناع فوار', quantity: 2, price: 210 }
    ],
    status: 'preparing',
    total: 1250,
    time: '11:10'
  },
  {
    id: 'rest-2',
    tableNumber: 'طاولة البحر 4',
    items: [
      { name: 'طبق ثمار البحر المشكلة الفاخر', quantity: 1, price: 550 },
      { name: 'شوربة كابوريا بالكريمة', quantity: 1, price: 180 },
      { name: 'شاي مثلج بالزعفران', quantity: 2, price: 120 }
    ],
    status: 'ordered',
    total: 850,
    time: '11:22'
  },
  {
    id: 'rest-3',
    tableNumber: 'الجناح 501',
    items: [
      { name: 'حساء العدس بالكمون الشامي', quantity: 1, price: 85 },
      { name: 'مشاوي مشكلة ليتك المميزة', quantity: 1, price: 280 },
      { name: 'مياه إيفيان مبردة', quantity: 3, price: 85 }
    ],
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

export const INITIAL_STAFF: Staff[] = [
  {
    id: 's1',
    name: 'محمد العتيبي',
    position: 'مدير الاستقبال',
    department: 'الاستقبال',
    email: 'mohammed.alotaibi@lytc.com',
    phone: '+966 50 123 4567',
    status: 'active',
    attendance: [
      { date: '2026-07-01', checkIn: '08:00', checkOut: '16:00', status: 'present' },
      { date: '2026-07-02', checkIn: '08:05', checkOut: '16:00', status: 'late' },
      { date: '2026-07-03', checkIn: '08:00', checkOut: '16:00', status: 'present' }
    ],
    performance: { rating: 4.8, completedTasks: 156, customerSatisfaction: 95, efficiency: 92 },
    completedTasks: 156,
    averageResponseTime: 8,
    shiftSchedule: [
      { day: 'الأحد', startTime: '08:00', endTime: '16:00' },
      { day: 'الاثنين', startTime: '08:00', endTime: '16:00' },
      { day: 'الثلاثاء', startTime: '08:00', endTime: '16:00' },
      { day: 'الأربعاء', startTime: '08:00', endTime: '16:00' },
      { day: 'الخميس', startTime: '08:00', endTime: '16:00' }
    ],
    rewards: [{ date: '2026-06', type: 'موظف الشهر', amount: 5000, reason: 'أداء متميز' }]
  },
  {
    id: 's2',
    name: 'فاطمة الحربي',
    position: 'مشرفة النظافة',
    department: 'النظافة',
    email: 'fatima.alharbi@lytc.com',
    phone: '+966 50 234 5678',
    status: 'active',
    attendance: [
      { date: '2026-07-01', checkIn: '06:00', checkOut: '14:00', status: 'present' },
      { date: '2026-07-02', checkIn: '06:00', checkOut: '14:00', status: 'present' },
      { date: '2026-07-03', checkIn: '06:00', checkOut: '14:00', status: 'present' }
    ],
    performance: { rating: 4.9, completedTasks: 234, customerSatisfaction: 98, efficiency: 95 },
    completedTasks: 234,
    averageResponseTime: 5,
    shiftSchedule: [
      { day: 'الأحد', startTime: '06:00', endTime: '14:00' },
      { day: 'الاثنين', startTime: '06:00', endTime: '14:00' },
      { day: 'الثلاثاء', startTime: '06:00', endTime: '14:00' },
      { day: 'الأربعاء', startTime: '06:00', endTime: '14:00' },
      { day: 'الخميس', startTime: '06:00', endTime: '14:00' },
      { day: 'الجمعة', startTime: '06:00', endTime: '14:00' }
    ],
    rewards: [
      { date: '2026-05', type: 'موظف الشهر', amount: 5000, reason: 'أداء متميز' },
      { date: '2026-06', type: 'جائزة التميز', amount: 3000, reason: 'قيادة متميزة' }
    ]
  },
  {
    id: 's3',
    name: 'أحمد الشمري',
    position: 'فني صيانة',
    department: 'الصيانة',
    email: 'ahmed.alshamrani@lytc.com',
    phone: '+966 50 345 6789',
    status: 'active',
    attendance: [
      { date: '2026-07-01', checkIn: '10:00', checkOut: '18:00', status: 'present' },
      { date: '2026-07-02', checkIn: '10:10', checkOut: '18:00', status: 'late' },
      { date: '2026-07-03', checkIn: '10:05', checkOut: '18:00', status: 'late' }
    ],
    performance: { rating: 4.5, completedTasks: 89, customerSatisfaction: 88, efficiency: 85 },
    completedTasks: 89,
    averageResponseTime: 12,
    shiftSchedule: [
      { day: 'الأحد', startTime: '10:00', endTime: '18:00' },
      { day: 'الاثنين', startTime: '10:00', endTime: '18:00' },
      { day: 'الثلاثاء', startTime: '10:00', endTime: '18:00' },
      { day: 'الأربعاء', startTime: '10:00', endTime: '18:00' },
      { day: 'الخميس', startTime: '10:00', endTime: '18:00' }
    ],
    rewards: []
  },
  {
    id: 's4',
    name: 'سارة العتيبي',
    position: 'مديرة المطعم',
    department: 'المطعم',
    email: 'sara.alotaibi@lytc.com',
    phone: '+966 50 456 7890',
    status: 'active',
    attendance: [
      { date: '2026-07-01', checkIn: '12:00', checkOut: '20:00', status: 'present' },
      { date: '2026-07-02', checkIn: '12:00', checkOut: '20:00', status: 'present' },
      { date: '2026-07-03', checkIn: '12:00', checkOut: '20:00', status: 'present' }
    ],
    performance: { rating: 4.9, completedTasks: 178, customerSatisfaction: 97, efficiency: 94 },
    completedTasks: 178,
    averageResponseTime: 6,
    shiftSchedule: [
      { day: 'الأحد', startTime: '12:00', endTime: '20:00' },
      { day: 'الاثنين', startTime: '12:00', endTime: '20:00' },
      { day: 'الثلاثاء', startTime: '12:00', endTime: '20:00' },
      { day: 'الأربعاء', startTime: '12:00', endTime: '20:00' },
      { day: 'الخميس', startTime: '12:00', endTime: '20:00' },
      { day: 'الجمعة', startTime: '12:00', endTime: '20:00' },
      { day: 'السبت', startTime: '12:00', endTime: '20:00' }
    ],
    rewards: [{ date: '2026-06', type: 'مديرة العام', amount: 10000, reason: 'قيادة استثنائية' }]
  },
  {
    id: 's5',
    name: 'خالد القحطاني',
    position: 'محاسب',
    department: 'المالية',
    email: 'khaled.alqahtani@lytc.com',
    phone: '+966 50 567 8901',
    status: 'on_leave',
    attendance: [
      { date: '2026-07-01', checkIn: '09:00', checkOut: '17:00', status: 'present' },
      { date: '2026-07-02', checkIn: '09:00', checkOut: '17:00', status: 'present' },
      { date: '2026-07-03', checkIn: '', checkOut: '', status: 'leave' }
    ],
    performance: { rating: 4.6, completedTasks: 120, customerSatisfaction: 90, efficiency: 88 },
    completedTasks: 120,
    averageResponseTime: 15,
    shiftSchedule: [
      { day: 'الأحد', startTime: '09:00', endTime: '17:00' },
      { day: 'الاثنين', startTime: '09:00', endTime: '17:00' },
      { day: 'الثلاثاء', startTime: '09:00', endTime: '17:00' },
      { day: 'الأربعاء', startTime: '09:00', endTime: '17:00' },
      { day: 'الخميس', startTime: '09:00', endTime: '17:00' }
    ],
    rewards: []
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
