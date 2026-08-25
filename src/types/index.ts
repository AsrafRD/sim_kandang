export * from './prisma';

// Anda bisa menambahkan tipe-tipe kustom UI atau Response API di sini
export type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export interface DashboardMetric {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: any;
}
