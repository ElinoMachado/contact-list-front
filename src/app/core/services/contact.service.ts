import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, PaginatedContact } from '../interfaces/paginated.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) {}

  findAll(params: {
    search?: string;
    isActive?: boolean;
    isFavorite?: boolean;
    page?: number;
    size?: number;
  }): Observable<PaginatedContact> {
    let httpParams = new HttpParams();

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.isActive !== undefined)
      httpParams = httpParams.set('isActive', params.isActive);
    if (params.isFavorite !== undefined)
      httpParams = httpParams.set('isFavorite', params.isFavorite);
    if (params.page !== undefined)
      httpParams = httpParams.set('page', params.page);
    if (params.size !== undefined)
      httpParams = httpParams.set('size', params.size);

    return this.http.get<PaginatedContact>(this.apiUrl, {
      params: httpParams,
    });
  }
  updateContact(id: number, data: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, data);
  }

  findById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }
  createContact(data: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, data);
  }
}
