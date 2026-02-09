/**
 * Business Unit Model - Dominio de Organización
 * 
 * Representa unidades de negocio dentro de la organización EconomyRPA
 */
export interface BusinessUnit {
  /** ID único de la unidad de negocio */
  id: string;
  
  /** Nombre de la unidad de negocio */
  name: string;
  
  /** Código identificador único */
  code: string;
  
  /** Descripción detallada */
  description?: string;
  
  /** Estado actual */
  status: BusinessUnitStatus;
  
  /** Manager responsable */
  managerId: string;
  /** Manager info poblada (opcional) */
  manager?: {
    id: string;
    fullName: string;
    email: string;
  };
  
  /** Lista de procesos asociados */
  processIds: string[];
  /** Procesos poblados (opcional) */
  processes?: BusinessProcess[];
  
  /** Métricas de rendimiento */
  metrics: {
    totalProcesses: number;
    activeAutomations: number;
    monthlySavings: number;
    efficiency: number; // 0-100
  };
  
  /** Fechas */
  createdAt: string;
  updatedAt: string;
}

/**
 * Estados de Unidad de Negocio
 */
export type BusinessUnitStatus = 
  | 'active'
  | 'inactive'
  | 'archived';

/**
 * Business Process Model - Procesos de Negocio
 */
export interface BusinessProcess {
  /** ID único del proceso */
  id: string;
  
  /** Nombre del proceso */
  name: string;
  
  /** Código identificador */
  code: string;
  
  /** Descripción del proceso */
  description?: string;
  
  /** Unidad de negocio propietaria */
  businessUnitId: string;
  
  /** Categoria del proceso */
  category: ProcessCategory;
  
  /** Prioridad */
  priority: ProcessPriority;
  
  /** Estado del proceso */
  status: ProcessStatus;
  
  /** RPA bots asignados */
  rpaBotIds: string[];
  /** RPA bots poblados (opcional) */
  rpaBots?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  
  /** Métricas del proceso */
  metrics: {
    avgExecutionTime: number; // minutos
    successRate: number; // 0-100
    monthlyExecutions: number;
    errorRate: number; // 0-100
    costSavings: number; // mensual
  };
  
  /** Fechas */
  createdAt: string;
  updatedAt: string;
}

/**
 * Categorías de Procesos
 */
export type ProcessCategory = 
  | 'finance'
  | 'hr'
  | 'operations'
  | 'customer_service'
  | 'it'
  | 'compliance'
  | 'other';

/**
 * Prioridades de Procesos
 */
export type ProcessPriority = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

/**
 * Estados de Procesos
 */
export type ProcessStatus = 
  | 'active'
  | 'inactive'
  | 'testing'
  | 'maintenance'
  | 'deprecated';

// Nota: User y RpaBot se importan desde el barrel index.ts para evitar circular deps