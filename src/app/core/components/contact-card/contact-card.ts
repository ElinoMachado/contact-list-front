import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Contact } from '../../interfaces/paginated.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-card',
  imports: [CommonModule],
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.scss',
})
export class ContactCard {
  router = inject(Router);
  @Input() contact!: Contact;
  @Output() favoriteToggled = new EventEmitter<Contact>();
  @Output() deactivated = new EventEmitter<Contact>();
  @Output() imageUploaded = new EventEmitter<{
    contact: Contact;
    file: File;
  }>();

  showUpload = false;
  onCardClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input[type="file"]') ||
      target.tagName === 'BUTTON'
    ) {
      return;
    }
    this.router.navigate(['/contacts', this.contact.id, 'edit']);
  }
  onToggleFavorite() {
    this.favoriteToggled.emit(this.contact);
  }

  onDeactivate() {
    this.deactivated.emit(this.contact);
  }

  onUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageUploaded.emit({ contact: this.contact, file });
    }
  }
}
