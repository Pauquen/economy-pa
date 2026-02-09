/**
 * RPA Bot Model - Sistema de Automatización
 * 
 * Representa bots de RPA que automatizan procesos de negocio
 */
export interface RpaBot {
  /** ID único del bot */
  id: string;
  
  /** Nombre del bot */
  name: string;
  
  /** Código identificador único */
  code: string;
  
  /** Descripción del bot */
  description?: string;
  
  /** Tipo de tecnología del bot */
  technology: RpaTechnology;
  
  /** Estado actual del bot */
  status: RpaStatus;
  
  /** Proceso asociado */
  processId: string;
  /** Proceso poblado (opcional) */
  process?: {
    id: string;
    name: string;
    category: string;
  };
  
  /** Configuración del bot */
  configuration: {
    executionSchedule?: string; // Cron expression
    retryAttempts: number;
    timeoutMinutes: number;
    maxMemoryMB: number;
  };
  
  /** Métricas de ejecución */
  metrics: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    avgExecutionTime: number; // segundos
    lastExecutionAt?: string;
    lastSuccessAt?: string;
    lastFailureAt?: string;
  };
  
  /** Logs recientes (últimos 10) */
  recentLogs: RpaExecutionLog[];
  
  /** Fechas */
  createdAt: string;
  updatedAt: string;
}

/**
 * Tecnologías de RPA Soportadas
 */
export type RpaTechnology = 
  | 'ui_path'
  | 'automation_anywhere'
  | 'blue_prism'
  | 'microsoft_power_automate'
  | 'python_selenium'
  | 'custom';

/**
 * Estados de RPA Bot
 */
export type RpaStatus = 
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'maintenance'
  | 'disabled';

/**
 * RPA Execution Log - Registro de Ejecuciones
 */
export interface RpaExecutionLog {
  /** ID único del log */
  id: string;
  
  /** ID del bot */
  botId: string;
  
  /** Estado de la ejecución */
  status: 'success' | 'failed' | 'timeout' | 'cancelled';
  
  /** Mensaje de resultado */
  message: string;
  
  /** Tiempo de ejecución en segundos */
  executionTime: number;
  
  /** Datos procesados */
  recordsProcessed?: number;
  
  /** Error detallado (si aplica) */
  error?: {
    code: string;
    message: string;
    stackTrace?: string;
  };
  
  /** Metadata adicional */
  metadata?: Record<string, any>;
  
  /** Timestamp de ejecución */
  executedAt: string;
}

/**
 * RPA Dashboard Metrics - Métricas para Dashboard
 */
export interface RpaDashboardMetrics {
  /** Total de bots activos */
  totalBots: number;
  
  /** Bots por estado */
  botsByStatus: Record<RpaStatus, number>;
  
  /** Ejecuciones en las últimas 24 horas */
  executions24h: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  
  /** Tiempo promedio de ejecución */
  avgExecutionTime: number;
  
  /** Ahorro de costos mensual */
  monthlyCostSavings: number;
  
  /** Tendencia de ejecuciones (últimos 7 días) */
  executionTrend: Array<{
    date: string;
    executions: number;
    successRate: number;
  }>;
}

// Nota: BusinessProcess se importa desde el barrel index.ts para evitar circular deps