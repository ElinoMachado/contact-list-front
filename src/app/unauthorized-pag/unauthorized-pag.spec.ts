import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UnauthorizedPag } from './unauthorized-pag';
import { Router } from '@angular/router';

describe('UnauthorizedPag', () => {
  let component: UnauthorizedPag;
  let fixture: ComponentFixture<UnauthorizedPag>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UnauthorizedPag],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedPag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should countdown every second and navigate when countdown reaches 0', fakeAsync(() => {
    component.ngOnInit();

    expect(component.countdown()).toBe(5);

    tick(1000);
    expect(component.countdown()).toBe(4);

    tick(1000);
    expect(component.countdown()).toBe(3);

    tick(1000);
    expect(component.countdown()).toBe(2);

    tick(1000);
    expect(component.countdown()).toBe(1);

    tick(1000);
    expect(component.countdown()).toBe(0);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));
});
