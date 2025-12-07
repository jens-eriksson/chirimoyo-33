import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Booking } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private firestore: Firestore = inject(Firestore);
  private bookingsCollection = collection(this.firestore, 'bookings');

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
    const bookingData = {
      ...booking,
      checkInDate: Timestamp.fromDate(booking.checkInDate),
      checkOutDate: Timestamp.fromDate(booking.checkOutDate),
      createdAt: Timestamp.now(),
      status: 'pending'
    };
    
    const docRef = await addDoc(this.bookingsCollection, bookingData);
    return docRef.id;
  }

  getBookings(): Observable<Booking[]> {
    const q = query(this.bookingsCollection, orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            checkInDate: data['checkInDate'].toDate(),
            checkOutDate: data['checkOutDate'].toDate(),
            createdAt: data['createdAt'].toDate()
          } as Booking;
        })
      )
    );
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    const q = query(
      this.bookingsCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            checkInDate: data['checkInDate'].toDate(),
            checkOutDate: data['checkOutDate'].toDate(),
            createdAt: data['createdAt'].toDate()
          } as Booking;
        })
      )
    );
  }

  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<void> {
    const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
    await updateDoc(bookingDoc, { status });
  }

  getBookedDates(): Observable<Date[]> {
    const q = query(
      this.bookingsCollection,
      where('status', 'in', ['confirmed', 'pending'])
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const dates: Date[] = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const checkIn = data['checkInDate'].toDate();
          const checkOut = data['checkOutDate'].toDate();
          
          // Add all dates between check-in and check-out
          const currentDate = new Date(checkIn);
          while (currentDate <= checkOut) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        return dates;
      })
    );
  }
}
