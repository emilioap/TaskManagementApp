import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Unexpected error. Please try again.';

      if (error.error?.error) {
        message = error.error.error;
      } else if (error.status === 404) {
        message = 'Resource not found.';
      } else if (error.status === 0) {
        message = 'Server unavailable.';
      }

      snackBar.open(message, 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};
