import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../interfaces/paginated.interface';

type ContactFilters = {
  search: string;
  page: number;
  size: number;
};

@Injectable({ providedIn: 'root' })
export class ContactStore {
  private contactService = inject(ContactService);

  private filters = signal<ContactFilters>({
    search: '',
    page: 0,
    size: 5,
  });

  readonly contacts = signal<Contact[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly currentPage = computed(() => this.filters().page);
  readonly pageSize = computed(() => this.filters().size);

  constructor() {
    effect(() => this.loadContacts());
  }

  setFilter(update: Partial<ContactFilters>) {
    this.filters.update((f) => ({ ...f, ...update }));
  }

  private loadContacts() {
    const params = this.filters();
    this.contactService.findAll(params).subscribe((res) => {
      let contacts = res.content;
      contacts = contacts.sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      this.contacts.set(contacts);
      this.totalElements.set(res.totalElements);
      this.totalPages.set(res.totalPages);
    });
  }

  nextPage() {
    if (this.filters().page < this.totalPages() - 1) {
      this.setFilter({ page: this.filters().page + 1 });
    }
  }

  prevPage() {
    if (this.filters().page > 0) {
      this.setFilter({ page: this.filters().page - 1 });
    }
  }

  changePageSize(size: number) {
    this.setFilter({ size, page: 0 });
  }

  search(text: string) {
    this.setFilter({ search: text, page: 0 });
  }

  addContacts(newContacts: Contact[]) {
    const updated = [...this.contacts(), ...newContacts];

    const sorted = updated.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    this.contacts.set(sorted);
    this.totalElements.set(this.totalElements() + newContacts.length);
  }

  updateContact(updated: Contact) {
    const updatedList = this.contacts().map((c) =>
      c.id === updated.id ? updated : c
    );

    const sorted = updatedList.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    this.contacts.set(sorted);
  }
}
