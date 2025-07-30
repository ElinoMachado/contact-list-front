import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactList } from './contact-list';
import { ContactStore } from '../../state/contact.store';
import { ContactService } from '../../services/contact.service';
import { of } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { signal } from '@angular/core';

describe('ContactList', () => {
  let component: ContactList;
  let fixture: ComponentFixture<ContactList>;

  // Mock de contatos iniciais
  const mockContacts = [
    {
      id: 1,
      name: 'Ana',
      isFavorite: false,
      isActive: true,
      email: 'ana@email.com',
      mobile: '11999999991',
      phone: '1133334441',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Beto',
      isFavorite: true,
      isActive: true,
      email: 'beto@email.com',
      mobile: '11999999992',
      phone: '1133334442',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Caio',
      isFavorite: false,
      isActive: false,
      email: 'caio@email.com',
      mobile: '11999999993',
      phone: '1133334443',
      createdAt: new Date().toISOString(),
    },
  ];

  // Mock do ContactStore usando Angular Signal
  const contactStoreMock = {
    contacts: signal(mockContacts),
    contacts_set: jasmine.createSpy('contacts.set'),
  };

  // Para mockar o setter do signal, vamos substituir o método 'set' do signal:
  contactStoreMock.contacts.set = contactStoreMock.contacts_set;

  // Mock do ContactService
  const contactServiceMock = {
    updateContact: jasmine.createSpy('updateContact').and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactList],
      providers: [
        { provide: ContactStore, useValue: contactStoreMock },
        { provide: ContactService, useValue: contactServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reorder contacts on drop', () => {
    const event: CdkDragDrop<any> = {
      previousIndex: 0,
      currentIndex: 2,
      container: null!,
      previousContainer: null!,
      isPointerOverContainer: true,
      item: null!,
      distance: { x: 0, y: 0 },
      dropPoint: { x: 0, y: 0 },
      event: {} as MouseEvent,
    };

    component.drop(event);

    expect(contactStoreMock.contacts_set).toHaveBeenCalled();
    const updatedList =
      contactStoreMock.contacts_set.calls.mostRecent().args[0];
    expect(updatedList.length).toBe(mockContacts.length);
    // Verifica se o item que estava na posição 0 foi para a 2
    expect(updatedList[2].id).toBe(mockContacts[0].id);
  });

  it('should toggle favorite and update store', () => {
    const contact = mockContacts[0];
    contactServiceMock.updateContact.and.returnValue(of({}));

    component.onFavoriteToggled(contact);

    expect(contactServiceMock.updateContact).toHaveBeenCalledWith(
      contact.id,
      jasmine.objectContaining({
        isFavorite: !contact.isFavorite,
      })
    );

    expect(contactStoreMock.contacts_set).toHaveBeenCalled();

    const newList = contactStoreMock.contacts_set.calls.mostRecent().args[0];
    // Verifica que o contato teve o isFavorite invertido
    const updatedContact = newList.find(
      (c: {
        id: number;
        name: string;
        isFavorite: boolean;
        isActive: boolean;
      }) => c.id === contact.id
    );
    expect(updatedContact?.isFavorite).toBe(true);
  });

  it('should toggle active state and update store', () => {
    const contact = mockContacts[2];
    contactServiceMock.updateContact.and.returnValue(of({}));

    component.onDeactivate(contact);

    expect(contactServiceMock.updateContact).toHaveBeenCalledWith(
      contact.id,
      jasmine.objectContaining({
        isActive: !contact.isActive,
      })
    );

    expect(contactStoreMock.contacts_set).toHaveBeenCalled();

    const newList = contactStoreMock.contacts_set.calls.mostRecent().args[0];
    // Verifica que o contato teve o isActive invertido
    const updatedContact = newList.find(
      (c: {
        id: number;
        name: string;
        isFavorite: boolean;
        isActive: boolean;
      }) => c.id === contact.id
    );
    expect(updatedContact?.isActive).toBe(true);
  });
});
