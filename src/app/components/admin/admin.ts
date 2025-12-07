import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking';
import { Booking, User } from '../../models/models';
import { Users } from '../users/users';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, Users],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  authService = inject(AuthService);
  bookingService = inject(BookingService);
  firestore = inject(Firestore);
  router = inject(Router);

  activeTab: 'bookings' | 'users' = 'bookings';
  bookings: Booking[] = [];
  loading = true;
  isAdmin = false;
  currentUserId = '';

  // User management
  users: User[] = [];
  usersLoading = false;
  userLoading = false;
  userError = '';
  userSuccess = '';
  showUserForm = false;
  newUser = {
    email: '',
    displayName: '',
    role: 'customer' as 'admin' | 'customer'
  };

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
      this.currentUserId = user.uid;
      this.loadBookings();
      this.loadUsers();
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

  async loadUsers() {
    this.usersLoading = true;
    try {
      const usersCollection = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      this.users = usersSnapshot.docs.map(doc => doc.data() as User);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      this.usersLoading = false;
    }
  }

  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
    if (!this.showUserForm) {
      // Reset form when closing
      this.newUser = { email: '', displayName: '', role: 'customer' };
      this.userError = '';
      this.userSuccess = '';
    }
  }

  async createUser() {
    this.userError = '';
    this.userSuccess = '';
    this.userLoading = true;

    try {
      // Generate a simple UID for the user
      const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const newUserData: User = {
        uid: uid,
        email: this.newUser.email,
        displayName: this.newUser.displayName || null,
        photoURL: null,
        role: this.newUser.role
      };

      const userDoc = doc(this.firestore, `users/${uid}`);
      await setDoc(userDoc, newUserData);

      this.userSuccess = 'Användare skapad! OBS: Användaren måste logga in med Google första gången.';
      this.newUser = { email: '', displayName: '', role: 'customer' };
      this.loadUsers();

      setTimeout(() => {
        this.userSuccess = '';
      }, 5000);
    } catch (err: any) {
      this.userError = 'Misslyckades med att skapa användare: ' + (err.message || 'Okänt fel');
    } finally {
      this.userLoading = false;
    }
  }

  async toggleUserRole(user: User) {
    if (user.uid === this.currentUserId) {
      return; // Can't change own role
    }

    try {
      const newRole = user.role === 'admin' ? 'customer' : 'admin';
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDoc, { role: newRole });
      this.loadUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
    }
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
    return new Date(date).toLocaleDateString('sv-SE', {
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
