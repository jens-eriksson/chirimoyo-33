import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  authService = inject(AuthService);
  bookingService = inject(BookingService);
  router = inject(Router);

  bookings: Booking[] = [];
  loading = true;
  isAdmin = false;

  async ngOnInit() {
    // Check if user is admin
    this.authService.currentUser$.subscribe(async user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      if (user.role !== 'admin') {
        this.router.navigate(['/']);
        return;
      }

      this.isAdmin = true;
      this.loadBookings();
    });
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.loading = false;
      }
    });
  }

  async updateStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') {
    try {
      await this.bookingService.updateBookingStatus(bookingId, status);
      this.loadBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getPendingCount(): number {
    return this.bookings.filter(b => b.status === 'pending').length;
  }

  getConfirmedCount(): number {
    return this.bookings.filter(b => b.status === 'confirmed').length;
  }

  getCancelledCount(): number {
    return this.bookings.filter(b => b.status === 'cancelled').length;
  }
}
