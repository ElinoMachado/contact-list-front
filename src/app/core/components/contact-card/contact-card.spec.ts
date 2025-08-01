import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactCard } from './contact-card';
import { Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';

describe('ContactCard', () => {
  let component: ContactCard;
  let fixture: ComponentFixture<ContactCard>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ContactCard],
      providers: [{ provide: Router, useValue: routerSpy },  provideNgxMask()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactCard);
    component = fixture.componentInstance;

    component.contact = {
      id: 1,
      name: 'Teste',
      email: 'teste@email.com',
      mobile: '11999999999',
      phone: '1133334444',
      isActive: true,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCardClick', () => {
    it('should navigate if clicked outside button and input', () => {
      const event = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;

      component.onCardClick(event);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/contacts', 1, 'edit']);
    });

    it('should NOT navigate if clicked on a button', () => {
      const button = document.createElement('button');
      const event = { target: button } as unknown as MouseEvent;

      component.onCardClick(event);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should NOT navigate if clicked on input file', () => {
      const inputFile = document.createElement('input');
      inputFile.type = 'file';
      const event = { target: inputFile } as unknown as MouseEvent;

      component.onCardClick(event);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  it('should emit favoriteToggled on onToggleFavorite', () => {
    spyOn(component.favoriteToggled, 'emit');

    component.onToggleFavorite();

    expect(component.favoriteToggled.emit).toHaveBeenCalledWith(
      component.contact
    );
  });

  it('should emit deactivated on onDeactivate', () => {
    spyOn(component.deactivated, 'emit');

    component.onDeactivate();

    expect(component.deactivated.emit).toHaveBeenCalledWith(component.contact);
  });
});
