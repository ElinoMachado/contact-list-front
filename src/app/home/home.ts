import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContactStore } from '../core/state/contact.store';
import { ContactList } from '../core/components/contact-list/contact-list';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [ContactList, HttpClientModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private store = inject(ContactStore);
  private router = inject(Router);

  filters = this.store;

  goToCreate() {
    this.router.navigate(['/contacts/create']);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.search(value);
  }

  onActiveToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.toggleActiveFilter(checked);
  }

  onFavoriteToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.toggleFavoriteFilter(checked);
  }

  onSizeChange(event: Event) {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.store.changePageSize(size);
  }

  prevPage() {
    this.store.prevPage();
  }

  nextPage() {
    this.store.nextPage();
  }
}
