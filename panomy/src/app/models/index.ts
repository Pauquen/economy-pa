/**
 * Index barrel para models - Export centralizado
 * 
 * Facilita imports y evita dependencias circulares
 */

// User Domain
export type { User, UserPreferences, UserRole, UserStatus } from './user.model';

// Business Domain  
export type { 
  BusinessUnit, 
  BusinessProcess, 
  BusinessUnitStatus, 
  ProcessCategory, 
  ProcessPriority, 
  ProcessStatus 
} from './business.model';

// RPA Domain
export type { 
  RpaBot, 
  RpaExecutionLog, 
  RpaDashboardMetrics, 
  RpaTechnology, 
  RpaStatus 
} from './rpa.model';

// API Response Types (comunes)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common UI Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: any;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}