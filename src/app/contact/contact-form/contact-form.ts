import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../core/interfaces/paginated.interface';
import { ContactService } from '../../core/services/contact.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ContactStore } from '../../core/state/contact.store';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private fb = inject(FormBuilder);
  private service = inject(ContactService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(ContactStore);
  private cdr = inject(ChangeDetectorRef);
  isEditMode = false;
  contactId?: number;
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', []],
    phone: [''],
    mobile: ['', [Validators.required]],
    isFavorite: [false],
    isActive: [true],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.contactId = +idParam;
      this.service.findById(this.contactId).subscribe((contact) => {
        this.form.patchValue(contact);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.value as Contact;

    if (this.isEditMode && this.contactId) {
      this.service.updateContact(this.contactId, data).subscribe((contact) => {
        this.store.updateContact(contact);
        this.router.navigate(['/']);
      });
    } else {
      this.service.createContact(data).subscribe({
        next: (contact) => {
          this.errorMessage.set(null);
          this.form.get('mobile')?.setErrors(null);
          this.store.addContacts([contact]);
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (
            error.status === 409 &&
            error.error?.message?.toLowerCase().includes('mobile')
          ) {
            this.form.get('mobile')?.setErrors({ duplicate: true });
            this.form.get('mobile')?.markAsTouched();
            this.errorMessage.set('Número de celular já cadastrado.');
          } else {
            this.errorMessage.set('Erro ao criar contato. Tente novamente.');
          }
        },
      });
    }
  }
}
