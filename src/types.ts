export interface Room {
  id: string;
  number: string;
  type: 'جناح ملكي' | 'جناح ديلوكس' | 'بنتهاوس فاخر' | 'غرفة بريميوم دبل' | 'غرفة كلاسيك';
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out_of_service';
  floor: number;
  pricePerNight: number;
  amenities: string[];
  guestName?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'checked_in' | 'checked_out' | 'upcoming' | 'cancelled';
  amount: number;
  guestId: string;
  adultCount: number;
  childrenCount: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVIP: boolean;
  stayCount: number;
  notes: string;
  avatarUrl?: string;
  nationality: string;
}

export interface ServiceRequest {
  id: string;
  roomNumber: string;
  type: 'room_service' | 'laundry' | 'housekeeping' | 'maintenance' | 'taxi' | 'reception' | 'spa';
  details: string;
  status: 'pending' | 'assigned' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  timestamp: string;
}

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  status: 'pending' | 'cleaning' | 'completed';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  lastCleaned?: string;
}

export interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'assigned' | 'completed';
  technician?: string;
  dateCreated: string;
}

export interface RestaurantOrder {
  id: string;
  tableNumber: string;
  items: string[];
  status: 'ordered' | 'preparing' | 'delivered';
  total: number;
  time: string;
}

export interface Invoice {
  id: string;
  guestName: string;
  roomNumber: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'refunded';
  date: string;
  method: 'بوابة دفع إلكترونية' | 'بطاقة ائتمان' | 'نقدًا' | 'تحويل بنكي';
}

export interface MarketingMetric {
  date: string;
  visitors: number;
  bookings: number;
  conversion: number;
  seoRank: number;
}
