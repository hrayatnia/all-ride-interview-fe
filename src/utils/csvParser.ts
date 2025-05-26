import Papa from 'papaparse';
import { User } from '../types/user';

interface CSVRow {
  firstName?: string;
  'First Name'?: string;
  lastName?: string;
  'Last Name'?: string;
  email?: string;
  Email?: string;
  phoneNumber?: string;
  'Phone Number'?: string;
  address?: string;
  Address?: string;
  birthDate?: string;
  'Birth Date'?: string;
  status?: string;
  Status?: string;
}

export const parseCSV = (file: File): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const users = results.data.map((row) => {
          const status = (row.status || row.Status || 'inactive').toLowerCase();
          return {
            firstName: row.firstName || row['First Name'] || '',
            lastName: row.lastName || row['Last Name'] || '',
            email: row.email || row.Email || '',
            phoneNumber: row.phoneNumber || row['Phone Number'] || '',
            address: row.address || row.Address || '',
            birthDate: row.birthDate || row['Birth Date'] || '',
            status: status === 'active' ? 'active' : 'inactive',
          } as User;
        });
        resolve(users);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}; 