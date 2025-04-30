import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Admin } from '../../../models/admin.model';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-form',
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
    RouterModule
  ],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css',
  standalone: true
})
export class AdminFormComponent {
  adminForm: FormGroup;
  isEditMode = false;
  adminId: string = "";

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.adminId = params['id'];
        this.loadAdminData(this.adminId);
      }
    });
  }

  loadAdminData(id: string): void {
    this.adminService.getAdmin(id).subscribe({
      next: (admin) => {
        const { password, ...adminData } = admin;
        this.adminForm.patchValue(adminData);
        this.adminForm.get('password')?.clearValidators();
        this.adminForm.get('password')?.updateValueAndValidity();
      },
      error: () => {
        this.snackBar.open('Failed to load admin data', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      return;
    }

    const adminId = this.isEditMode ? this.adminId : `${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`;

    const adminData: Admin = {
      ...this.adminForm.value,
      id: adminId
    };

    const operation = this.isEditMode 
      ? this.adminService.updateAdmin(this.adminId!, adminData)
      : this.adminService.createAdmin(adminData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Admin ${this.isEditMode ? 'updated' : 'created'} successfully!`, 
          'Close', 
          { duration: 3000 }
        );
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.snackBar.open(
          `Failed to ${this.isEditMode ? 'update' : 'create'} admin`, 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }
}
