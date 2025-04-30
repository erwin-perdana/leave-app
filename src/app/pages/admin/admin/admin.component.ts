import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Admin } from '../../../models/admin.model';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { AdminService } from '../../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true
})
export class AdminComponent {
  displayedColumns = ['no', 'name', 'email', 'actions'];
  admins: Admin[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoading = true;
    this.adminService.getAdmins().subscribe({
      next: (admins: Admin[]) => {
        this.admins = admins;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteAdmin(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this admin?' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.adminService.deleteAdmin(id).subscribe({
          next: () => this.loadAdmins(),
          error: () => {}
        });
      }
    });
  }
}
