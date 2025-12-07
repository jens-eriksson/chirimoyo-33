import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);
  
  loading = false;
  error = '';

  async signInWithGoogle() {
    this.loading = true;
    this.error = '';

    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.message || 'Misslyckades med att logga in med Google';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
