import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { Router } from '@angular/router';
import { ContactStore } from '../core/state/contact.store';

function createMockSignal<T>(initialValue: T) {
  let value = initialValue;
  const signal = function () {
    return value;
  } as any;
  signal.set = function (newValue: T) {
    value = newValue;
  };
  signal.update = function (fn: (v: T) => T) {
    value = fn(value);
  };
  signal.asReadonly = function () {
    return signal;
  };
  return signal;
}

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeMock: Partial<ContactStore>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    storeMock = {
      contacts: createMockSignal([]),
      totalElements: createMockSignal(0),
      totalPages: createMockSignal(0),
      currentPage: createMockSignal(0),
      pageSize: createMockSignal(10),
      search: jasmine.createSpy('search'),
      changePageSize: jasmine.createSpy('changePageSize'),
      prevPage: jasmine.createSpy('prevPage'),
      nextPage: jasmine.createSpy('nextPage'),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ContactStore, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.search on onSearch', () => {
    const inputEvent = {
      target: { value: 'test' },
    } as unknown as Event;

    component.onSearch(inputEvent);
    expect(storeMock.search).toHaveBeenCalledWith('test');
  });

  it('should call store.changePageSize on onSizeChange', () => {
    const selectEvent = {
      target: { value: '15' },
    } as unknown as Event;

    component.onSizeChange(selectEvent);
    expect(storeMock.changePageSize).toHaveBeenCalledWith(15);
  });

  it('should call store.prevPage on prevPage', () => {
    component.prevPage();
    expect(storeMock.prevPage).toHaveBeenCalled();
  });

  it('should call store.nextPage on nextPage', () => {
    component.nextPage();
    expect(storeMock.nextPage).toHaveBeenCalled();
  });

  it('should call router.navigate on goToCreate', () => {
    component.goToCreate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/contacts/create']);
  });
});
