import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { errorMessage } from '../../http-error';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  error = '';
  info = '';
  loading = false;

  ngOnInit(): void {
    const state = history.state as { message?: string };
    this.info = state?.message ?? '';
  }

  submit(): void {
    this.error = '';
    this.info = '';
    if (!this.username.trim() || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.loading = true;
    this.auth.login(this.username.trim(), this.password).subscribe({
      next: (response) => {
        this.session.setSession(response);
        void this.router.navigate([this.session.homeRoute()]);
      },
      error: (error: unknown) => {
        this.loading = false;
        this.error = errorMessage(error, 'Invalid username or password');
      },
    });
  }
}
