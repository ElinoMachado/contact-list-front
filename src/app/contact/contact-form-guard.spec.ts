import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { contactFormGuard } from './contact-form-guard';
import { AuthService } from '../core/services/auth';
import { Router } from '@angular/router';

describe('contactFormGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const route = new ActivatedRouteSnapshot();
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['hasPermission']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access when user has permission', () => {
    route.data = { permission: 'create' };
    mockAuthService.hasPermission.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      contactFormGuard(route, state)
    );

    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect when user lacks permission', () => {
    route.data = { permission: 'update' };
    mockAuthService.hasPermission.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      contactFormGuard(route, state)
    );

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
