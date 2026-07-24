import { Routes } from '@angular/router';
import { ClientShellComponent } from './layout/client-shell/client-shell.component';
import { hasDateTimeGuard, hasSubmissionGuard } from './features/booking/booking-flow.guard';

export const routes: Routes = [
  {
    path: '',
    component: ClientShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
      },
      {
        path: 'sobre',
        loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'agendar',
        children: [
          { path: '', redirectTo: 'calendario', pathMatch: 'full' },
          {
            path: 'calendario',
            loadComponent: () =>
              import('./features/booking/booking-calendar/booking-calendar.component').then(
                (m) => m.BookingCalendarComponent,
              ),
          },
          {
            path: 'formulario',
            canActivate: [hasDateTimeGuard],
            loadComponent: () =>
              import('./features/booking/booking-form/booking-form.component').then((m) => m.BookingFormComponent),
          },
          {
            path: 'confirmacao',
            canActivate: [hasSubmissionGuard],
            loadComponent: () =>
              import('./features/booking/booking-confirmation/booking-confirmation.component').then(
                (m) => m.BookingConfirmationComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  { path: '**', redirectTo: '' },
];
