// API Service for LYTC Hotel Management Dashboard
// Base URL: https://lytc-hotel-backend.onrender.com

const API_BASE_URL = 'https://lytc-hotel-backend.onrender.com';

// Types based on OpenAPI specification
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  refreshToken?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

interface CreateSpecialOfferRequest {
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  applicableRoomTypes?: string[];
  minNights?: number;
  maxGuests?: number;
}

interface SpecialOfferResponse {
  id: number;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  applicableRoomTypes?: string[];
  minNights?: number;
  maxGuests?: number;
  active: boolean;
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

// API Service Class
class APIService {
  private baseURL: string;
  private token: string | null = null;

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

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
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
    const response = await fetch(`${this.baseURL}/api/dashboard/front-desk/special-offers`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(offer),
    });

    return this.handleResponse<SpecialOfferResponse>(response);
  }

  /**
   * Update Special Offer API
   * PUT /api/dashboard/front-desk/special-offers/{id}
   */
  async updateSpecialOffer(id: number, offer: Partial<CreateSpecialOfferRequest>): Promise<SpecialOfferResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/front-desk/special-offers/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(offer),
    });

    return this.handleResponse<SpecialOfferResponse>(response);
  }

  /**
   * Patch Special Offer API (partial update)
   * PATCH /api/dashboard/front-desk/special-offers/{id}
   */
  async patchSpecialOffer(id: number, offer: Partial<CreateSpecialOfferRequest>): Promise<SpecialOfferResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/front-desk/special-offers/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(offer),
    });

    return this.handleResponse<SpecialOfferResponse>(response);
  }

  // ==================== MENU ITEMS APIs ====================

  /**
   * Create Menu Item for Room Service
   * POST /api/dashboard/room-service/menu
   */
  async createRoomServiceMenuItem(item: CreateMenuItemRequest): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/room-service/menu`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Create Menu Item for Restaurant
   * POST /api/dashboard/restaurant/menu
   */
  async createRestaurantMenuItem(item: CreateMenuItemRequest): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/restaurant/menu`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Create Menu Item for Cafe
   * POST /api/dashboard/cafe/menu
   */
  async createCafeMenuItem(item: CreateMenuItemRequest): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/cafe/menu`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Update Menu Item for Room Service
   * PUT /api/dashboard/room-service/menu/{id}
   */
  async updateRoomServiceMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/room-service/menu/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Update Menu Item for Restaurant
   * PUT /api/dashboard/restaurant/menu/{id}
   */
  async updateRestaurantMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/restaurant/menu/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Update Menu Item for Cafe
   * PUT /api/dashboard/cafe/menu/{id}
   */
  async updateCafeMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/cafe/menu/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Patch Menu Item for Room Service (partial update)
   * PATCH /api/dashboard/room-service/menu/{id}
   */
  async patchRoomServiceMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/room-service/menu/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Patch Menu Item for Restaurant (partial update)
   * PATCH /api/dashboard/restaurant/menu/{id}
   */
  async patchRestaurantMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/restaurant/menu/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
  }

  /**
   * Patch Menu Item for Cafe (partial update)
   * PATCH /api/dashboard/cafe/menu/{id}
   */
  async patchCafeMenuItem(id: number, item: Partial<CreateMenuItemRequest>): Promise<MenuItemResponse> {
    const response = await fetch(`${this.baseURL}/api/dashboard/cafe/menu/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(item),
    });

    return this.handleResponse<MenuItemResponse>(response);
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
};
