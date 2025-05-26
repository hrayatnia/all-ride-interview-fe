export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  status: 'active' | 'inactive';
}

export interface UserImportError {
  row: number;
  errors: string[];
}

export interface ImportResult {
  successful: User[];
  failed: UserImportError[];
  totalProcessed: number;
} 