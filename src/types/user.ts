export interface User {
  key?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  status?: 'active' | 'inactive';
}

export interface ImportError {
  row: number;
  errors: string[];
}

export interface ImportResult {
  successful: User[];
  failed: ImportError[];
  totalProcessed: number;
} 