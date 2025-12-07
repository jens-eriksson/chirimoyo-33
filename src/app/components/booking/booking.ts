import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingComponent {
  authService = inject(AuthService);
  bookingService = inject(BookingService);
  router = inject(Router);

  bookingData = {
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    message: ''
  };

  loading = false;
  error = '';
  success = false;
  minDate = new Date().toISOString().split('T')[0];

  async submitBooking() {
    this.error = '';
    this.loading = true;

    try {
      const user = await new Promise<any>((resolve) => {
        this.authService.currentUser$.subscribe(user => resolve(user));
      });

      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      if (!this.bookingData.checkInDate || !this.bookingData.checkOutDate) {
        this.error = 'Please select check-in and check-out dates';
        this.loading = false;
        return;
      }

      const checkIn = new Date(this.bookingData.checkInDate);
      const checkOut = new Date(this.bookingData.checkOutDate);

      if (checkOut <= checkIn) {
        this.error = 'Check-out date must be after check-in date';
        this.loading = false;
        return;
      }

      const booking: Omit<Booking, 'id' | 'createdAt'> = {
        userId: user.uid,
        userName: user.displayName || 'Guest',
        userEmail: user.email,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: this.bookingData.guests,
        status: 'pending',
        message: this.bookingData.message
      };

      await this.bookingService.createBooking(booking);
      this.success = true;
      
      // Reset form
      this.bookingData = {
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
        message: ''
      };

      setTimeout(() => {
        this.success = false;
      }, 5000);

    } catch (err) {
      this.error = 'Failed to create booking. Please try again.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
