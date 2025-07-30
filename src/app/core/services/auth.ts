import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private permissions: string[] = [/* 'create' */ 'read', 'update', 'delete'];

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}
