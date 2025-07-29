import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth';

export const contactFormGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const action = route.data?.['permission']; // 'create' | 'read' | 'update' | 'delete'
  if (auth.hasPermission(action)) {
    return true;
  }
  router.navigate(['/unauthorized']);
  return false;
};
