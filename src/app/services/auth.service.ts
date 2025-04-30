import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AdminService } from './admin.service';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentAdmin = new BehaviorSubject<Admin | null>(null);

  constructor(
    private router: Router,
    private adminService: AdminService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkLocalStorage();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get currentAdmin$() {
    return this.currentAdmin.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.adminService.login(email, password).pipe(
      map(admins => {
        if (admins.length > 0) {
          this.loggedIn.next(true);
          this.currentAdmin.next(admins[0]);
          if (this.isBrowser) {
            localStorage.setItem('currentAdmin', JSON.stringify(admins[0]));
          }
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    this.loggedIn.next(false);
    this.currentAdmin.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('currentAdmin');
    }
    this.router.navigate(['/login']);
  }

  checkLocalStorage() {
    if (this.isBrowser) {
      const admin = localStorage.getItem('currentAdmin');
      this.loggedIn.next(!!admin);
      if (admin) {
        this.currentAdmin.next(JSON.parse(admin));
      }
    }
  }
  
  getCurrentAdmin() {
    return this.currentAdmin.value;
  }

  setCurrentAdmin(admin: Admin): void {
    this.currentAdmin.next(admin);
    if (this.isBrowser) {
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
    }
  }
}