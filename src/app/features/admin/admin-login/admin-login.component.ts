import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly password = signal('');
  readonly error = signal(false);

  onPasswordInput(value: string): void {
    this.password.set(value);
    this.error.set(false);
  }

  submit(): void {
    if (this.authService.login(this.password())) {
      this.router.navigateByUrl('/admin');
    } else {
      this.error.set(true);
    }
  }
}
