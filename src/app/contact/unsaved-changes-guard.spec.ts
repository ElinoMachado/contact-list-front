import { TestBed } from '@angular/core/testing';
import {
  UnsavedChangesGuard,
  CanComponentDeactivate,
} from './unsaved-changes-guard';

describe('UnsavedChangesGuard', () => {
  let guard: UnsavedChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnsavedChangesGuard);
  });

  it('should allow deactivation if canDeactivate returns true', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => true,
    };
    expect(guard.canDeactivate(component)).toBeTrue();
  });

  it('should block deactivation if canDeactivate returns false', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false,
    };
    expect(guard.canDeactivate(component)).toBeFalse();
  });
});
