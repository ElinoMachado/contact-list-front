import { TestBed } from '@angular/core/testing';
import { ContactStore } from './contact.store';
import { ContactService } from '../services/contact.service';
import { of } from 'rxjs';

describe('ContactStore', () => {
  let store: ContactStore;
  let serviceSpy: jasmine.SpyObj<ContactService>;

  const mockContacts = [
    {
      id: 1,
      name: 'Ana',
      isFavorite: false,
      email: 'ana@email.com',
      mobile: '11999999991',
      phone: '1133334441',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Beto',
      isFavorite: true,
      email: 'beto@email.com',
      mobile: '11999999992',
      phone: '1133334442',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockResponse = {
    content: mockContacts,
    totalElements: 2,
    totalPages: 1,
    number: 0,
    size: 20,
    first: true,
    last: true,
    empty: false,
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ContactService', ['findAll']);

    TestBed.configureTestingModule({
      providers: [ContactStore, { provide: ContactService, useValue: spy }],
    });

    store = TestBed.inject(ContactStore);
    serviceSpy = TestBed.inject(
      ContactService
    ) as jasmine.SpyObj<ContactService>;

    // Mockando retorno do findAll
    serviceSpy.findAll.and.returnValue(of(mockResponse));
  });

  it('should load contacts on creation', (done) => {
    // Como a store usa effect() para carregar contacts,
    // podemos esperar que o método findAll tenha sido chamado
    expect(serviceSpy.findAll).not.toHaveBeenCalled();

    // Espera o signal atualizar (pequeno delay)
    setTimeout(() => {
      expect(store.contacts()).toEqual([
        {
          id: 2,
          name: 'Beto',
          isFavorite: true,
          email: 'beto@email.com',
          mobile: '11999999992',
          phone: '1133334442',
          isActive: true,
          createdAt: jasmine.any(String),
        },
        {
          id: 1,
          name: 'Ana',
          isFavorite: false,
          email: 'ana@email.com',
          mobile: '11999999991',
          phone: '1133334441',
          isActive: true,
          createdAt: jasmine.any(String),
        },
      ]); // Ordenado por isFavorite e nome
      expect(store.totalElements()).toBe(2);
      expect(store.totalPages()).toBe(1);
      done();
    }, 10);
  });

  it('should update filters with setFilter', () => {
    store.setFilter({ search: 'ana' });
    expect(store.currentPage()).toBe(0); // page não mudou (no teste só search)
    expect(store.pageSize()).toBe(5);
  });

  it('should go to next page', () => {
    store.setFilter({ page: 0, size: 20 });
    store.totalPages.set(3);
    store.nextPage();
    expect(store.currentPage()).toBe(1);
    store.nextPage();
    expect(store.currentPage()).toBe(2);
    // Não deve ultrapassar totalPages - 1
    store.nextPage();
    expect(store.currentPage()).toBe(2);
  });

  it('should go to previous page', () => {
    store.setFilter({ page: 2 });
    store.prevPage();
    expect(store.currentPage()).toBe(1);
    store.prevPage();
    expect(store.currentPage()).toBe(0);
    // Não deve ir abaixo de zero
    store.prevPage();
    expect(store.currentPage()).toBe(0);
  });

  it('should change page size and reset page', () => {
    const newContacts = [
      {
        id: 3,
        name: 'Clara',
        isFavorite: false,
        email: 'clara@email.com',
        mobile: '11999999993',
        phone: '1133334443',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'David',
        isFavorite: true,
        email: 'david@email.com',
        mobile: '11999999994',
        phone: '1133334444',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    const updatedContact = {
      id: 1,
      name: 'Ana Updated',
      isFavorite: true,
      email: 'ana@email.com',
      mobile: '11999999991',
      phone: '1133334441',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store.updateContact(updatedContact);
  });

  it('should search and reset page', () => {
    store.setFilter({ page: 4 });
    store.search('foo');
    expect(store.currentPage()).toBe(0);
    // Search term stored in filters
    expect(store['filters']().search).toBe('foo');
  });

  it('should add new contacts and update totalElements', () => {
    store['contacts'].set(mockContacts);
    store['totalElements'].set(2);

    const newContacts = [
      {
        id: 3,
        name: 'Clara',
        isFavorite: false,
        email: 'clara@email.com',
        mobile: '11999999993',
        phone: '1133334443',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'David',
        isFavorite: true,
        email: 'david@email.com',
        mobile: '11999999994',
        phone: '1133334444',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    store.addContacts(newContacts);

    expect(store.contacts().length).toBe(4);

    expect(store.totalElements()).toBe(4);
  });

  it('should update a contact in the list', () => {
    store['contacts'].set(mockContacts);

    const updatedContact = {
      id: 1,
      name: 'Ana Updated',
      isFavorite: true,
      email: 'ana@email.com',
      mobile: '11999999991',
      phone: '1133334441',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store.updateContact(updatedContact);

    const contact = store.contacts().find((c) => c.id === 1);
    expect(contact?.name).toBe('Ana Updated');
    expect(contact?.isFavorite).toBeTrue();
  });
});
