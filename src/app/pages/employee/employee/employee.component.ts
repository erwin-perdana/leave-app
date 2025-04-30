import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  standalone: true
})
export class EmployeeComponent {
  displayedColumns = ['no', 'name', 'email', 'phone', 'actions'];
  employees: Employee[] = [];
  isLoading = true;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteEmployee(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this employee?' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => this.loadEmployees(),
          error: () => {}
        });
      }
    });
  }
}
