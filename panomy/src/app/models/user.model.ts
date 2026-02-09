/**
 * User Model - Dominio de Autenticación y Perfil
 * 
 * Interface plana siguiendo best practices de Angular 20 + TypeScript
 */
export interface User {
  /** ID único del usuario */
  id: string;
  
  /** Email único del sistema */
  email: string;
  
  /** Nombre completo del usuario */
  fullName: string;
  
  /** Avatar URL (opcional) */
  avatarUrl?: string;
  
  /** Rol del usuario en el sistema */
  role: UserRole;
  
  /** Estado de la cuenta */
  status: UserStatus;
  
  /** Fecha de creación */
  createdAt: string;
  
  /** Último acceso */
  lastLoginAt?: string;
  
  /** Última actualización del perfil */
  updatedAt?: string;
}

/**
 * Enumeración de Roles de Usuario
 */
export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'operator'
  | 'viewer';

/**
 * Enumeración de Estados de Usuario
 */
export type UserStatus = 
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending';

/**
 * User Preferences - Configuración personal del usuario
 */
export interface UserPreferences {
  /** Idioma preferido */
  language: string;
  
  /** Tema visual preferido */
  theme: 'light' | 'dark' | 'auto';
  
  /** Zona horaria */
  timezone: string;
  
  /** Notificaciones activas */
  notifications: {
    email: boolean;
    browser: boolean;
    desktop: boolean;
  };
  
  /** Dashboard layout personalizado */
  dashboardLayout: {
    widgets: string[];
    columns: number;
  };
}