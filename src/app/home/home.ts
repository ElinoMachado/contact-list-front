import { Component, inject, OnInit } from '@angular/core';
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
export class Home implements OnInit {
  private store = inject(ContactStore);
  private router = inject(Router);

  filters = this.store;

  goToCreate() {
    this.router.navigate(['/contacts/create']);
  }
  ngOnInit(): void {
    this.store.search('');
  }
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.search(value);
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
