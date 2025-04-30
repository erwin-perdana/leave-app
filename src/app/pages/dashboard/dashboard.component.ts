import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent {
  stats = [
    { title: 'Total Users', value: '1,234' },
    { title: 'Total Products', value: '567' },
    { title: 'Total Sales', value: '$89,765' }
  ];
}
