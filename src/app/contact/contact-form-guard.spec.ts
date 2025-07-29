import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { contactFormGuard } from './contact-form-guard';

describe('contactFormGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => contactFormGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
