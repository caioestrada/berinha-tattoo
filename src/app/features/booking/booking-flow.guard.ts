import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingFlowService } from './booking-flow.service';

/** Blocks /agendar/formulario unless a date+time was picked on the calendar step. */
export const hasDateTimeGuard: CanActivateFn = () => {
  const bookingFlow = inject(BookingFlowService);
  return bookingFlow.hasDateTime() || inject(Router).parseUrl('/agendar/calendario');
};

/** Blocks /agendar/confirmacao unless a booking was actually submitted. */
export const hasSubmissionGuard: CanActivateFn = () => {
  const bookingFlow = inject(BookingFlowService);
  return bookingFlow.hasSubmission() || inject(Router).parseUrl('/agendar/calendario');
};
