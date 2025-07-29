import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ContactForm } from './contact/contact-form/contact-form';
import { contactFormGuard } from './contact/contact-form-guard';
import { UnauthorizedPag } from './unauthorized-pag/unauthorized-pag';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [contactFormGuard],
    data: { permission: 'read' },
  },
  {
    path: 'contacts/create',
    component: ContactForm,
    canActivate: [contactFormGuard],
    data: { permission: 'create' },
  },
  {
    path: 'contacts/:id/edit',
    component: ContactForm,
    canActivate: [contactFormGuard],
    data: { permission: 'update' },
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPag,
    data: { title: 'Acesso Negado' },
  },
];
