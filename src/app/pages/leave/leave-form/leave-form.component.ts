import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Leave } from '../../../models/leave.model';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, of } from 'rxjs';
import { generateId } from '../../../utils/common.utils';

@Component({
  selector: 'app-leave-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    RouterModule,
    MatDatepickerModule,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.css',
  standalone: true,
})
export class LeaveFormComponent {
  leaveForm: FormGroup;
  isEditMode = false;
  leaveId: string = "";
  employeeId!: string;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.leaveForm = this.fb.group({
      reason: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId') ?? "";
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.leaveId = params['id'];
        this.loadLeaveData(this.leaveId);
      }
    });
  }

  loadLeaveData(id: string): void {
    this.leaveService.getLeavesByEmployee(this.employeeId).subscribe(leaves => {
      const leave = leaves.find(l => l.id === id);
      if (leave) {
        this.leaveForm.patchValue({
          reason: leave.reason,
          startDate: new Date(leave.startDate),
          endDate: new Date(leave.endDate)
        });
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      return;
    }

    const leaveData = {
      ...this.leaveForm.value,
      employeeId: this.employeeId,
      status: 'pending',
      id: this.isEditMode ? this.leaveId : generateId()
    };

    this.validateLeaveRules(this.leaveForm.value).subscribe(isValid => {
      if (!isValid) return;

      const operation = this.isEditMode && this.leaveId
      ? this.leaveService.updateLeave(this.leaveId, leaveData)
      : this.leaveService.createLeave(leaveData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Leave ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Close', { duration: 3000 });
          this.router.navigate(['/employees', this.employeeId, 'leaves']);
        },
        error: (error) => {
          this.snackBar.open(`Failed to ${this.isEditMode ? 'update' : 'create'} leave`, 'Close', { duration: 3000 });
        }
      });
    });
  }

  private validateLeaveRules(leave: Leave): Observable<boolean> {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const today = new Date();
    
    // clear time
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    // check if today
    if (startDate <= today) {
      this.snackBar.open('You cannot take leave today', 'Close', { duration: 3000 });
      return of(false);
    }

    // check if day off
    if (startDate.getDay() === 0 || startDate.getDay() === 6) {
      this.snackBar.open('Leave must be taken on a working day', 'Close', { duration: 3000 });
      return of(false);
    }
  
    // check date range
    if (startDate > endDate) {
      this.snackBar.open('End date must be after start date', 'Close', { duration: 3000 });
      return of(false);
    }
  
    // Calculate leave days
    const leaveDays = this.calculateLeaveDays(startDate, endDate);
  
    return this.leaveService.getLeavesByEmployee(this.employeeId).pipe(
      map(leaves => {
        const currentYear = new Date().getFullYear();
        const yearlyLeaves = leaves.filter(l => {
          const lDate = new Date(l.startDate);
          return lDate.getFullYear() === currentYear && l.status !== 'rejected';
        });
  
        // check max 12 days
        const totalDays = yearlyLeaves.reduce((sum, l) => {
          return sum + this.calculateLeaveDays(new Date(l.startDate), new Date(l.endDate));
        }, 0);

        if (totalDays + leaveDays > 12) {
          this.snackBar.open('Maximum 12 leave days per year exceeded', 'Close', { duration: 3000 });
          return false;
        }
  
        // check same leave in same month
        const hasLeaveInSameMonth = yearlyLeaves.some(l => {
          if (this.isEditMode && l.id === this.leaveId) {
            return false;
          }
          
          return (
            new Date(l.startDate).getMonth() === startDate.getMonth() && 
            new Date(l.startDate).getFullYear() === startDate.getFullYear()
          );
        });

        if (hasLeaveInSameMonth) {
          this.snackBar.open('You have taken / applied for leave this month', 'Close', { duration: 3000 });
          return false;
        }
  
        // check 1 day/month rule
        if (leaveDays > 1) {
          this.snackBar.open('Only 1 leave day allowed per month', 'Close', { duration: 3000 });
          return false;
        }
  
        return true;
      })
    );
  }

  private calculateLeaveDays(start: Date, end: Date): number {
    // calculate working days except weekend
    let count = 0;
    const curDate = new Date(start);
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {// skip saturday and sunday
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }
}
