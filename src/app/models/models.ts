export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'customer';
}

export interface Booking {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  message?: string;
  createdAt: Date;
}

export interface Availability {
  date: Date;
  available: boolean;
  bookingId?: string;
}
