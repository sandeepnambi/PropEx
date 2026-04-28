// frontend/src/types/index.ts
export type UserRole = 'Buyer' | 'Admin' | 'Tenant' | 'Manager' | 'Owner';

export type PropertyType = 'House' | 'Condo' | 'Townhouse' | 'Land' | 'Apartment';

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IImage {
  url: string;
  altText?: string;
  isPrimary?: boolean;
  orderIndex?: number;
}

export interface IAgent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface IListing {
  _id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqFt: number;
  propertyType: PropertyType;
  yearBuilt?: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  images: IImage[];
  agent: IAgent | string;
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  isFeatured: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  features?: string[];
  amenities?: string[];
}

export interface ITenant {
  _id: string;
  tenant: IUser;
  property: IListing;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: 'Active' | 'Expired' | 'Terminated';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  profilePhoto?: string;
  savedProperties?: string[];
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePhoto?: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoggedIn: boolean;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends Omit<AuthState, 'error'> {
  login: (token: string, user: IUser) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  API_BASE_URL: string;
  setError: (error: string | null) => void;
}

// Common API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Common pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPayment {
  _id: string;
  tenantId: ITenant | string;
  propertyId: IListing | string;
  amount: number;
  paymentDate?: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}