export interface Employee {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: String;
    gender: 'male' | 'female' | 'other';
    address: string;
  }