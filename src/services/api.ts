// API Service for LYTC Hotel Management Dashboard
// Base URL: https://lytc-hotel-backend.onrender.com

const API_BASE_URL = 'https://lytc-hotel-backend.onrender.com';

// Types based on OpenAPI specification
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: string;
  userId: number;
  username: string;
  tokenType: string;
}

interface CreateSpecialOfferRequest {
  title: string;
  description: string;
}

interface SpecialOfferResponse {
  id: number;
  title: string;
  description: string;
}

interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  preparationTime?: number;
  imageUrl?: string;
}

interface CreateOrderRequest {
  category: 'FOOD' | 'DRINK' | 'SERVICE';
  items: OrderItemRequest[];
}

interface RoomResponse {
  id: number;
  roomNumber: string;
  status: string;
  maxAdults: number;
  maxKids: number;
  floor: number;
  price: string;
  description: string;
}

interface CreateRoomRequest {
  roomNumber: string;
  maxAdults?: number;
  maxKids?: number;
  description?: string;
  floor?: number;
  price: number;
}

interface UpdateRoomRequest {
  roomNumber: string;
  maxAdults?: number;
  maxKids?: number;
  description?: string;
  floor?: number;
  price: number;
  status: string;
}

interface PatchRoomRequest {
  roomNumber?: string;
  maxAdults?: number;
  maxKids?: number;
  description?: string;
  floor?: number;
  price?: number;
  status?: string;
}

// Stays related types
interface StayDetailsResponse {
  stayId: number;
  checkInTime: string;
  expectedCheckOutDate: string;
  checkOutTime: string;
  status: string;
  stars: number;
  notes: string;
  roomCharge: number;
  totalCharge: number;
  guestId: number;
  guestName: string;
  guestPhone: string;
  roomId: number;
  roomNumber: string;
  floor: number;
  description: string;
  maxAdults: number;
  maxKids: number;
  numAdults: number;
  numKids: number;
}

interface CreateStayRequest {
  guestName: string;
  phone: string;
  roomNumber: string;
  numAdults: number;
  numKids?: number;
  expectedCheckInDate: string;
  expectedCheckOutDate: string;
  dateRangeValid?: boolean;
}

interface CreateSpecialOrderRequest {
  specialOfferId: number;
  agreedPrice: number;
}

interface SpecialOrderResponse {
  id: number;
  stayId: number;
  specialOfferId: number;
  agreedPrice: number;
  status: string;
}

interface PageStayDetailsResponse {
  content: StayDetailsResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
}

interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
  notes?: string;
}

interface MenuItemResponse {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  available: boolean;
  preparationTime?: number;
  imageUrl?: string;
}

// Manager related types
interface UserResponse {
  id: number;
  username: string;
  role: string;
}

interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
}

interface UpdateUserRequest {
  username?: string;
  password?: string;
  role?: string;
}

interface PageUserResponse {
  content: UserResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
}

interface EmployeeResponse {
  id: number;
  fullName: string;
  phone: string;
  job: string;
  department: string;
  status: string;
}

interface CreateEmployeeRequest {
  fullName: string;
  phone: string;
  job: string;
  department: string;
}

interface UpdateEmployeeStatusRequest {
  status: string;
}

interface PageEmployeeResponse {
  content: EmployeeResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
}

interface VipResponse {
  id: number;
  fullName: string;
  phone: string;
  nationality: string;
  notes: string;
}

interface PageVipResponse {
  content: VipResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
}

// Stats related types
interface DashboardStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayRevenue: number;
}

interface PendingOrdersResponse {
  orderId: number;
  guestName: string;
  roomNumber: string;
  items: string;
  totalAmount: number;
  orderTime: string;
  status: string;
}

// API Service Class
class APIService {
  private baseURL: string;
  private token: string | null = null;
  private isRefreshing: boolean = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  // Helper method to get headers
  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Always try to send token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log('Sending token in Authorization header:', this.token.substring(0, 20) + '...');
    }

    return headers;
  }

  // Helper method to handle response with automatic token refresh
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Helper method to make authenticated requests with automatic token refresh
  private async authenticatedFetch<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const makeRequest = async (): Promise<Response> => {
      return fetch(url, {
        ...options,
        headers: this.getHeaders(true),
      });
    };

    let response = await makeRequest();

    // If 401 and not already refreshing, try to refresh token
    if (response.status === 401 && this.token && !this.isRefreshing) {
      this.isRefreshing = true;
      try {
        await this.refreshToken();
        this.isRefreshing = false;
        // Retry the request with new token
        response = await makeRequest();
      } catch (refreshError) {
        this.isRefreshing = false;
        // If refresh fails, clear token and redirect to login
        this.clearToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
    }

    return this.handleResponse<T>(response);
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // ==================== AUTHENTICATION APIs ====================

  /**
   * Login API
   * POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    
    // Store token if present in response
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  /**
   * Refresh Token API
   * POST /api/auth/refresh
   */
  async refreshToken(): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(false),
      credentials: 'include', // For cookies
    });

    const data = await this.handleResponse<LoginResponse>(response);
    
    // Update token if present in response
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  /**
   * Logout API
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    await this.handleResponse<void>(response);
    
    // Clear token from storage
    this.clearToken();
  }

  // ==================== SPECIAL OFFERS APIs ====================

  /**
   * Create Special Offer API
   * POST /api/dashboard/front-desk/special-offers
   */
  async createSpecialOffer(offer: CreateSpecialOfferRequest): Promise<SpecialOfferResponse> {
    return this.authenticatedFetch<SpecialOfferResponse>(
      `${this.baseURL}/api/dashboard/front-desk/special-offers`,
      {
        method: 'POST',
        body: JSON.stringify(offer),
      }
    );
  }

  /**
   * Update Special Offer API
   * PUT /api/dashboard/front-desk/special-offers/{id}
   */
  async updateSpecialOffer(id: number, offer: { title?: string; description?: string }): Promise<SpecialOfferResponse> {
    return this.authenticatedFetch<SpecialOfferResponse>(
      `${this.baseURL}/api/dashboard/front-desk/special-offers/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(offer),
      }
    );
  }

  /**
   * Patch Special Offer API (partial update)
   * PATCH /api/dashboard/front-desk/special-offers/{id}
   */
  async patchSpecialOffer(id: number, offer: { title?: string; description?: string }): Promise<SpecialOfferResponse> {
    return this.authenticatedFetch<SpecialOfferResponse>(
      `${this.baseURL}/api/dashboard/front-desk/special-offers/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(offer),
      }
    );
  }

  /**
   * Get Special Offers for Guest
   * GET /api/guest/special-offers
   */
  async getSpecialOffers(page: number = 0, size: number = 10): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/guest/special-offers?page=${page}&size=${size}`,
      {
        method: 'GET',
      }
    );
  }

  // ==================== MENU ITEMS APIs ====================

  /**
   * Create Menu Item for Room Service
   * POST /api/dashboard/room-service/menu
   */
  async createRoomServiceMenuItem(item: CreateMenuItemRequest): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/room-service/menu`,
      {
        method: 'POST',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Create Menu Item for Restaurant
   * POST /api/dashboard/restaurant/menu
   */
  async createRestaurantMenuItem(item: CreateMenuItemRequest): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/restaurant/menu`,
      {
        method: 'POST',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Create Menu Item for Cafe
   * POST /api/dashboard/cafe/menu
   */
  async createCafeMenuItem(item: CreateMenuItemRequest): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/cafe/menu`,
      {
        method: 'POST',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Update Menu Item for Room Service
   * PUT /api/dashboard/room-service/menu/{id}
   */
  async updateRoomServiceMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/room-service/menu/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Update Menu Item for Restaurant
   * PUT /api/dashboard/restaurant/menu/{id}
   */
  async updateRestaurantMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/restaurant/menu/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Update Menu Item for Cafe
   * PUT /api/dashboard/cafe/menu/{id}
   */
  async updateCafeMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/cafe/menu/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Patch Menu Item for Room Service (partial update)
   * PATCH /api/dashboard/room-service/menu/{id}
   */
  async patchRoomServiceMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/room-service/menu/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Patch Menu Item for Restaurant (partial update)
   * PATCH /api/dashboard/restaurant/menu/{id}
   */
  async patchRestaurantMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/restaurant/menu/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(item),
      }
    );
  }

  /**
   * Patch Menu Item for Cafe (partial update)
   * PATCH /api/dashboard/cafe/menu/{id}
   */
  async patchCafeMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    return this.authenticatedFetch<MenuItemResponse>(
      `${this.baseURL}/api/dashboard/cafe/menu/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(item),
      }
    );
  }

  // ==================== ORDER APIs ====================

  /**
   * Create Order for Guest
   * POST /api/guest/orders
   */
  async createGuestOrder(roomNumber: string, order: CreateOrderRequest): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/guest/orders?roomNumber=${roomNumber}`,
      {
        method: 'POST',
        body: JSON.stringify(order),
      }
    );
  }

  /**
   * Get Guest Orders
   * GET /api/guest/orders
   */
  async getGuestOrders(roomNumber: string, page: number = 0, size: number = 10): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/guest/orders?roomNumber=${roomNumber}&page=${page}&size=${size}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Cancel Order
   * POST /api/guest/orders/{orderId}/cancel
   */
  async cancelOrder(orderId: number, roomNumber: string): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/guest/orders/${orderId}/cancel?roomNumber=${roomNumber}`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Get Order Details
   * GET /api/guest/orders/{orderId}
   */
  async getOrderDetails(orderId: number, roomNumber: string): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/guest/orders/${orderId}?roomNumber=${roomNumber}`,
      {
        method: 'GET',
      }
    );
  }

  // ==================== ROOMS APIs ====================

  /**
   * Get Rooms
   * GET /api/dashboard/front-desk/rooms
   */
  async getRooms(
    status?: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE',
    floor?: number,
    page: number = 0,
    size: number = 10
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) params.append('status', status);
    if (floor !== undefined) params.append('floor', floor.toString());

    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/front-desk/rooms?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Create Room
   * POST /api/dashboard/front-desk/rooms
   */
  async createRoom(room: CreateRoomRequest): Promise<RoomResponse> {
    return this.authenticatedFetch<RoomResponse>(
      `${this.baseURL}/api/dashboard/front-desk/rooms`,
      {
        method: 'POST',
        body: JSON.stringify(room),
      }
    );
  }

  /**
   * Update Room
   * PUT /api/dashboard/front-desk/rooms/{id}
   */
  async updateRoom(id: number, room: UpdateRoomRequest): Promise<RoomResponse> {
    return this.authenticatedFetch<RoomResponse>(
      `${this.baseURL}/api/dashboard/front-desk/rooms/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(room),
      }
    );
  }

  /**
   * Patch Room (partial update)
   * PATCH /api/dashboard/front-desk/rooms/{id}
   */
  async patchRoom(id: number, room: PatchRoomRequest): Promise<RoomResponse> {
    return this.authenticatedFetch<RoomResponse>(
      `${this.baseURL}/api/dashboard/front-desk/rooms/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(room),
      }
    );
  }

  // ==================== STAYS APIs ====================

  /**
   * Get Stays
   * GET /api/dashboard/front-desk/stays
   */
  async getStays(
    page: number = 0,
    size: number = 10
  ): Promise<PageStayDetailsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<PageStayDetailsResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Create Stay
   * POST /api/dashboard/front-desk/stays
   */
  async createStay(stay: CreateStayRequest): Promise<StayDetailsResponse> {
    console.log('API: Creating stay with body:', JSON.stringify(stay, null, 2));
    return this.authenticatedFetch<StayDetailsResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays`,
      {
        method: 'POST',
        body: JSON.stringify(stay),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  /**
   * Check-in Stay
   * PUT /api/dashboard/front-desk/stays/{stayId}/checkin
   */
  async checkInStay(stayId: number): Promise<StayDetailsResponse> {
    return this.authenticatedFetch<StayDetailsResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays/${stayId}/checkin`,
      {
        method: 'PUT',
      }
    );
  }

  /**
   * Check-out Stay
   * PUT /api/dashboard/front-desk/stays/{stayId}/checkout
   */
  async checkOutStay(stayId: number): Promise<StayDetailsResponse> {
    return this.authenticatedFetch<StayDetailsResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays/${stayId}/checkout`,
      {
        method: 'PUT',
      }
    );
  }

  /**
   * Get Stay Orders
   * GET /api/dashboard/front-desk/stays/{stayId}/orders
   */
  async getStayOrders(stayId: number): Promise<any[]> {
    return this.authenticatedFetch<any[]>(
      `${this.baseURL}/api/dashboard/front-desk/stays/${stayId}/orders`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Stay Special Orders
   * GET /api/dashboard/front-desk/stays/{stayId}/special-orders
   */
  async getStaySpecialOrders(stayId: number): Promise<SpecialOrderResponse[]> {
    return this.authenticatedFetch<SpecialOrderResponse[]>(
      `${this.baseURL}/api/dashboard/front-desk/stays/${stayId}/special-orders`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Create Stay Special Order
   * POST /api/dashboard/front-desk/stays/{stayId}/special-orders
   */
  async createStaySpecialOrder(stayId: number, order: CreateSpecialOrderRequest): Promise<SpecialOrderResponse> {
    return this.authenticatedFetch<SpecialOrderResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays/${stayId}/special-orders`,
      {
        method: 'POST',
        body: JSON.stringify(order),
      }
    );
  }

  /**
   * Get Checkout Today Stays
   * GET /api/dashboard/front-desk/stays/checkout-today
   */
  async getCheckoutTodayStays(): Promise<PageStayDetailsResponse> {
    return this.authenticatedFetch<PageStayDetailsResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays/checkout-today`,
      {
        method: 'GET',
      }
    );
  }

  // ==================== MANAGER APIs ====================

  /**
   * Get Users
   * GET /api/dashboard/manager/users
   */
  async getUsers(
    page: number = 0,
    size: number = 10
  ): Promise<PageUserResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<PageUserResponse>(
      `${this.baseURL}/api/dashboard/manager/users?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update User
   * PUT /api/dashboard/manager/users/{id}
   */
  async updateUser(id: number, user: UpdateUserRequest): Promise<UserResponse> {
    return this.authenticatedFetch<UserResponse>(
      `${this.baseURL}/api/dashboard/manager/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(user),
      }
    );
  }

  /**
   * Get Employees
   * GET /api/dashboard/manager/employees
   */
  async getEmployees(
    page: number = 0,
    size: number = 10
  ): Promise<PageEmployeeResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<PageEmployeeResponse>(
      `${this.baseURL}/api/dashboard/manager/employees?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update Employee Status
   * PUT /api/dashboard/manager/employees/{id}/status
   */
  async updateEmployeeStatus(id: number, status: UpdateEmployeeStatusRequest): Promise<EmployeeResponse> {
    return this.authenticatedFetch<EmployeeResponse>(
      `${this.baseURL}/api/dashboard/manager/employees/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify(status),
      }
    );
  }

  /**
   * Get VIP Guests
   * GET /api/dashboard/manager/vips
   */
  async getVips(
    page: number = 0,
    size: number = 10
  ): Promise<PageVipResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<PageVipResponse>(
      `${this.baseURL}/api/dashboard/manager/vips?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Rated Stays
   * GET /api/dashboard/manager/stays/rated
   */
  async getRatedStays(): Promise<PageStayDetailsResponse> {
    return this.authenticatedFetch<PageStayDetailsResponse>(
      `${this.baseURL}/api/dashboard/manager/stays/rated`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Special Orders
   * GET /api/dashboard/manager/special-orders
   */
  async getManagerSpecialOrders(): Promise<SpecialOrderResponse[]> {
    return this.authenticatedFetch<SpecialOrderResponse[]>(
      `${this.baseURL}/api/dashboard/manager/special-orders`,
      {
        method: 'GET',
      }
    );
  }

  // ==================== STATS AND PENDING ORDERS APIs ====================

  /**
   * Get Room Service Stats
   * GET /api/dashboard/room-service/stats
   */
  async getRoomServiceStats(): Promise<DashboardStatsResponse> {
    return this.authenticatedFetch<DashboardStatsResponse>(
      `${this.baseURL}/api/dashboard/room-service/stats`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Room Service Pending Orders
   * GET /api/dashboard/room-service/pending-orders
   */
  async getRoomServicePendingOrders(): Promise<PendingOrdersResponse[]> {
    return this.authenticatedFetch<PendingOrdersResponse[]>(
      `${this.baseURL}/api/dashboard/room-service/pending-orders`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update Room Service Order Status
   * PATCH /api/dashboard/room-service/orders/{orderId}/status
   */
  async updateRoomServiceOrderStatus(orderId: number, status: string): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/room-service/orders/${orderId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  }

  /**
   * Get Restaurant Stats
   * GET /api/dashboard/restaurant/stats
   */
  async getRestaurantStats(): Promise<DashboardStatsResponse> {
    return this.authenticatedFetch<DashboardStatsResponse>(
      `${this.baseURL}/api/dashboard/restaurant/stats`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Restaurant Pending Orders
   * GET /api/dashboard/restaurant/pending-orders
   */
  async getRestaurantPendingOrders(): Promise<PendingOrdersResponse[]> {
    return this.authenticatedFetch<PendingOrdersResponse[]>(
      `${this.baseURL}/api/dashboard/restaurant/pending-orders`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update Restaurant Order Status
   * PATCH /api/dashboard/restaurant/orders/{orderId}/status
   */
  async updateRestaurantOrderStatus(orderId: number, status: string): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/restaurant/orders/${orderId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  }

  /**
   * Get Cafe Stats
   * GET /api/dashboard/cafe/stats
   */
  async getCafeStats(): Promise<DashboardStatsResponse> {
    return this.authenticatedFetch<DashboardStatsResponse>(
      `${this.baseURL}/api/dashboard/cafe/stats`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Cafe Pending Orders
   * GET /api/dashboard/cafe/pending-orders
   */
  async getCafePendingOrders(): Promise<PendingOrdersResponse[]> {
    return this.authenticatedFetch<PendingOrdersResponse[]>(
      `${this.baseURL}/api/dashboard/cafe/pending-orders`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update Cafe Order Status
   * PATCH /api/dashboard/cafe/orders/{orderId}/status
   */
  async updateCafeOrderStatus(orderId: number, status: string): Promise<any> {
    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/cafe/orders/${orderId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  }

  /**
   * Get Check-in Today Stays
   * GET /api/dashboard/front-desk/stays/checkin-today
   */
  async getCheckinTodayStays(): Promise<PageStayDetailsResponse> {
    return this.authenticatedFetch<PageStayDetailsResponse>(
      `${this.baseURL}/api/dashboard/front-desk/stays/checkin-today`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Room Service Menu
   * GET /api/dashboard/room-service/menu
   */
  async getRoomServiceMenu(
    page: number = 0,
    size: number = 10
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/room-service/menu?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Restaurant Menu
   * GET /api/dashboard/restaurant/menu
   */
  async getRestaurantMenu(
    page: number = 0,
    size: number = 10
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/restaurant/menu?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get Cafe Menu
   * GET /api/dashboard/cafe/menu
   */
  async getCafeMenu(
    page: number = 0,
    size: number = 10
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.authenticatedFetch<any>(
      `${this.baseURL}/api/dashboard/cafe/menu?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }
}

// Export singleton instance
export const apiService = new APIService(API_BASE_URL);

// Export types for use in components
export type {
  LoginRequest,
  LoginResponse,
  CreateSpecialOfferRequest,
  SpecialOfferResponse,
  CreateMenuItemRequest,
  MenuItemResponse,
  CreateOrderRequest,
  OrderItemRequest,
  RoomResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  PatchRoomRequest,
  StayDetailsResponse,
  CreateStayRequest,
  CreateSpecialOrderRequest,
  SpecialOrderResponse,
  PageStayDetailsResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  PageUserResponse,
  EmployeeResponse,
  CreateEmployeeRequest,
  UpdateEmployeeStatusRequest,
  PageEmployeeResponse,
  VipResponse,
  PageVipResponse,
  DashboardStatsResponse,
  PendingOrdersResponse,
};
