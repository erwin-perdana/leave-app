export interface Admin {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    gender: 'male' | 'female' | 'other';
    password?: string;
  }