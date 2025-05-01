import { Component } from '@angular/core';
import { LeaveService } from '../../../services/leave.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Leave } from '../../../models/leave.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leave',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css',
  standalone: true,
})
export class LeaveComponent {
  displayedColumns: string[] = ['reason', 'startDate', 'endDate', 'days', 'status', 'actions'];
  dataSource = new MatTableDataSource<Leave>();
  employeeId: string;

  constructor(
    private leaveService: LeaveService,
    private route: ActivatedRoute
  ) {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId') ?? "";
  }

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getLeavesByEmployee(this.employeeId).subscribe(leaves => {
      this.dataSource.data = leaves.map(leave => ({
        ...leave,
        days: this.calculateLeaveDays(new Date(leave.startDate), new Date(leave.endDate))
      }));
    });
  }

  calculateLeaveDays(start: Date, end: Date): number {
    let count = 0;
    const curDate = new Date(start);
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }

  deleteLeave(id: string): void {
    this.leaveService.deleteLeave(id).subscribe(() => {
      this.loadLeaves();
    });
  }
}
