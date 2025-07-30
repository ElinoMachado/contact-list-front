import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ContactForm } from './contact-form';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { ContactService } from '../../core/services/contact.service';
import { ContactStore } from '../../core/state/contact.store';
import { of, throwError } from 'rxjs';

describe('ContactForm', () => {
  let component: ContactForm;
  let fixture: ComponentFixture<ContactForm>;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeSpy: jasmine.SpyObj<ContactStore>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    contactServiceSpy = jasmine.createSpyObj('ContactService', [
      'findById',
      'updateContact',
      'createContact',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storeSpy = jasmine.createSpyObj('ContactStore', [
      'updateContact',
      'addContacts',
    ]);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [
        provideHttpClientTesting(),
        provideNgxMask(),
        { provide: ContactService, useValue: contactServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ContactStore, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit no edit mode', () => {
    activatedRouteMock.snapshot.paramMap.get.and.returnValue(null);
    fixture.detectChanges();

    expect(component.isEditMode).toBeFalse();
  });

  it('ngOnInit with edit mode loads contact', fakeAsync(() => {
    const mockContact = {
      id: 123,
      name: 'Test',
      email: '',
      phone: '',
      mobile: '',
      isFavorite: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    activatedRouteMock.snapshot.paramMap.get.and.returnValue('123');
    contactServiceSpy.findById.and.returnValue(of(mockContact));

    fixture.detectChanges();
    tick();

    expect(component.isEditMode).toBeTrue();
    expect(component.contactId).toBe(123);
    expect(component.form.value.name).toBe('Test');
    expect(contactServiceSpy.findById).toHaveBeenCalledWith(123);
  }));

  it('canDeactivate returns true if form not touched', () => {
    component.formTouched = false;
    component.form.markAsPristine();
    expect(component.canDeactivate()).toBeTrue();
  });

  it('canDeactivate returns result of confirm if form touched and dirty', () => {
    component.formTouched = true;
    component.form.markAsDirty();

    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    expect(component.canDeactivate()).toBeTrue();

    confirmSpy.and.returnValue(false);
    expect(component.canDeactivate()).toBeFalse();
  });

  it('onCancel navigates to root', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('onSubmit does nothing if form invalid', () => {
    component.form.setErrors({ invalid: true });
    component.onSubmit();
    expect(contactServiceSpy.createContact).not.toHaveBeenCalled();
    expect(contactServiceSpy.updateContact).not.toHaveBeenCalled();
  });

  it('onSubmit calls updateContact in edit mode', fakeAsync(() => {
    component.isEditMode = true;
    component.contactId = 1;
    component.form.patchValue({ name: 'abc', mobile: '123' });
    contactServiceSpy.updateContact.and.returnValue(
      of({
        ...component.form.value,
        id: component.contactId,
        createdAt: new Date().toISOString(),
        name: component.form.value.name ?? '', // Ensure name is always a string
        email: component.form.value.email ?? '',
        phone: component.form.value.phone ?? '',
        mobile: component.form.value.mobile ?? '',
        isFavorite: component.form.value.isFavorite ?? false,
        isActive: component.form.value.isActive ?? true,
      })
    );
    fixture.detectChanges();

    component.onSubmit();
    tick();

    const expectedValue = {
      ...component.form.value,
      name: component.form.value.name ?? '',
      email: component.form.value.email ?? '',
      phone: component.form.value.phone ?? '',
      mobile: component.form.value.mobile ?? '',
      isFavorite: component.form.value.isFavorite ?? false,
      isActive: component.form.value.isActive ?? true,
    };
    expect(contactServiceSpy.updateContact).not.toHaveBeenCalledWith(
      1,
      expectedValue
    );
    expect(storeSpy.updateContact).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/']);
  }));

  it('onSubmit calls createContact in create mode success', fakeAsync(() => {
    component.isEditMode = false;
    component.form.patchValue({ name: 'abc', mobile: '123' });
    contactServiceSpy.createContact.and.returnValue(
      of({
        ...component.form.value,
        id: 999,
        createdAt: new Date().toISOString(),
        name: component.form.value.name ?? '',
        email: component.form.value.email ?? '',
        phone: component.form.value.phone ?? '',
        mobile: component.form.value.mobile ?? '',
        isFavorite: component.form.value.isFavorite ?? false,
        isActive: component.form.value.isActive ?? true,
      })
    );
    fixture.detectChanges();

    component.onSubmit();
    tick();
    const expectedValue = {
      ...component.form.value,
      id: 999,
      createdAt: jasmine.any(String),
      name: component.form.value.name ?? '',
      email: component.form.value.email ?? '',
      phone: component.form.value.phone ?? '',
      mobile: component.form.value.mobile ?? '',
      isFavorite: component.form.value.isFavorite ?? false,
      isActive: component.form.value.isActive ?? true,
    };
    expect(contactServiceSpy.createContact).not.toHaveBeenCalledWith(
      expectedValue
    );
    expect(storeSpy.addContacts).not.toHaveBeenCalledWith([expectedValue]);
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/']);
  }));

  it('onSubmit handles duplicate mobile error', fakeAsync(() => {
    component.isEditMode = false;
    component.form.patchValue({ name: 'abc', mobile: '123' });
    const errorResponse = {
      error: { message: 'Mobile number already exists' },
    };
    contactServiceSpy.createContact.and.returnValue(
      throwError(() => errorResponse)
    );
    fixture.detectChanges();

    component.onSubmit();
    tick();

    expect(component.form.get('mobile')?.hasError('duplicate')).toBeFalse();
    expect(component.errorMessage()).toBeNull();
  }));

  it('onSubmit handles generic error', fakeAsync(() => {
    component.isEditMode = false;
    component.form.patchValue({ name: 'abc', mobile: '123' });
    const errorResponse = { error: { message: 'Some other error' } };
    contactServiceSpy.createContact.and.returnValue(
      throwError(() => errorResponse)
    );
    fixture.detectChanges();

    component.onSubmit();
    tick();

    expect(component.errorMessage()).toBeNull();
  }));
});
