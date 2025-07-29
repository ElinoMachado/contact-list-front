export interface Paginated<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface Contact {
  id: number;
  name: string;
  email: string;
  mobile: string;
  phone: string;
  isFavorite: boolean;
  isActive: boolean;
  imageUrl?: string;
  updatedAt: string;
}
export interface PaginatedContact extends Paginated<Contact> {}
