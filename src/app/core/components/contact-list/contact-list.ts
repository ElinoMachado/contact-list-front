import { Component, inject } from '@angular/core';
import { Contact } from '../../interfaces/paginated.interface';
import { ContactService } from '../../services/contact.service';
import { ContactStore } from '../../state/contact.store';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ContactCard } from '../contact-card/contact-card';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule, ContactCard, DragDropModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  store = inject(ContactStore);
  contactService = inject(ContactService);

  contacts = this.store.contacts;

  drop(event: CdkDragDrop<Contact[]>) {
    const list = [...this.contacts()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.store.contacts.set(list);
  }

  onFavoriteToggled(contact: Contact) {
    const updated = { ...contact, isFavorite: !contact.isFavorite };
    this.contactService.updateContact(contact.id, updated).subscribe(() => {
      const updatedList = this.contacts().map((c) =>
        c.id === contact.id ? updated : c
      );
      this.store.contacts.set(
        updatedList.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
          return a.name.localeCompare(b.name);
        })
      );
    });
  }

  onDeactivate(contact: Contact) {
    const updated = { ...contact, isActive: !contact.isActive };
    this.contactService.updateContact(contact.id, updated).subscribe(() => {
      const updatedList = this.contacts().map((c) =>
        c.id === contact.id ? updated : c
      );
      this.store.contacts.set(
        updatedList.sort((a, b) => {
          if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
          return a.name.localeCompare(b.name);
        })
      );
    });
  }
}
