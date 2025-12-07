import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Calendar } from './components/calendar/calendar';
import { BookingComponent } from './components/booking/booking';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'calendar', component: Calendar },
  { path: 'booking', component: BookingComponent },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' }
];
