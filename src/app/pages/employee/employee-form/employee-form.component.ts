import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { generateId } from '../../../utils/common.utils';

@Component({
  selector: 'app-employee-form',
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
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  standalone: true
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string = "";

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(11)]],
      gender: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = params['id'];
        this.loademployeeData(this.employeeId);
      }
    });
  }

  loademployeeData(id: string): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        const { ...employeeData } = employee;
        this.employeeForm.patchValue(employeeData);
      },
      error: () => {
        this.snackBar.open('Failed to load employee data', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const employeeId = this.isEditMode ? this.employeeId : generateId();

    const employeeData: Employee = {
      ...this.employeeForm.value,
      id: employeeId
    };

    const operation = this.isEditMode 
      ? this.employeeService.updateEmployee(this.employeeId!, employeeData)
      : this.employeeService.createEmployee(employeeData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Employee ${this.isEditMode ? 'updated' : 'created'} successfully!`, 
          'Close', 
          { duration: 3000 }
        );
        this.router.navigate(['/employee']);
      },
      error: () => {
        this.snackBar.open(
          `Failed to ${this.isEditMode ? 'update' : 'create'} employee`, 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }
}
