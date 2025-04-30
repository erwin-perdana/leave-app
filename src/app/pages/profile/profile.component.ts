import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Admin } from '../../models/admin.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true,
})
export class ProfileComponent {
  profileForm!: FormGroup;
  admin!: Admin;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.admin = this.authService.getCurrentAdmin()!;
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.admin.firstName, Validators.required],
      lastName: [this.admin.lastName, Validators.required],
      email: [this.admin.email, [Validators.required, Validators.email]],
      birthDate: [new Date(this.admin.birthDate), Validators.required],
      gender: [this.admin.gender, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const updatedAdmin: Admin = {
      ...this.admin,
      ...this.profileForm.value
    };

    this.adminService.updateAdmin(this.admin.id!, updatedAdmin).subscribe({
      next: (admin) => {
        this.authService.setCurrentAdmin(admin);
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }
}
