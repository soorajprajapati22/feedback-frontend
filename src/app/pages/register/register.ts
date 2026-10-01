import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { errorMessage } from '../../http-error';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  submit(): void {
    this.error = '';
    const username = this.username.trim();
    const email = this.email.trim();

    if (!username || !email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill all fields';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error = 'Please enter a valid email';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.auth
      .register({
        username,
        email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      })
      .subscribe({
        next: (response) => {
          void this.router.navigate(['/login'], { state: { message: response.message } });
        },
        error: (error: unknown) => {
          this.loading = false;
          this.error = errorMessage(error, 'Could not register');
        },
      });
  }
}
