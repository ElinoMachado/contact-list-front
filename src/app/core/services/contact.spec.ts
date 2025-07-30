import { TestBed } from '@angular/core/testing';
import { ContactService } from './contact.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Contact } from '../interfaces/paginated.interface';
import { environment } from '../../environments/environment';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/contacts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call findAll with query params', () => {
    const mockResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
      first: true,
      last: true,
      empty: true,
    };

    const params = {
      search: 'test',
      isActive: true,
      isFavorite: false,
      page: 1,
      size: 10,
    };

    service.findAll(params).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === apiUrl &&
        r.params.get('search') === 'test' &&
        r.params.get('isActive') === 'true' &&
        r.params.get('isFavorite') === 'false' &&
        r.params.get('page') === '1' &&
        r.params.get('size') === '10'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call findById', () => {
    const mockContact: Contact = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '123456789',
      phone: '987654321',
      isFavorite: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    service.findById(1).subscribe((res) => {
      expect(res).toEqual(mockContact);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContact);
  });

  it('should call createContact', () => {
    const newContact: Contact = {
      id: 2,
      name: 'Jane',
      email: 'jane@example.com',
      mobile: '123123123',
      phone: '321321321',
      isFavorite: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    service.createContact(newContact).subscribe((res) => {
      expect(res).toEqual(newContact);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newContact);
    req.flush(newContact);
  });

  it('should call updateContact', () => {
    const updateData: Partial<Contact> = {
      name: 'Updated Name',
    };

    const updatedContact: Contact = {
      id: 1,
      name: 'Updated Name',
      email: 'updated@example.com',
      mobile: '99999999',
      phone: '88888888',
      isFavorite: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    service.updateContact(1, updateData).subscribe((res) => {
      expect(res).toEqual(updatedContact);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(updatedContact);
  });
});
