import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../interfaces/paginated.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-card',
  imports: [CommonModule],
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.scss',
})
export class ContactCard {
  @Input() contact!: Contact;
  @Output() favoriteToggled = new EventEmitter<Contact>();
  @Output() deactivated = new EventEmitter<Contact>();
  @Output() imageUploaded = new EventEmitter<{
    contact: Contact;
    file: File;
  }>();

  showUpload = false;

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
