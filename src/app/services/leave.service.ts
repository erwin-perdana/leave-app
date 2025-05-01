import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Leave } from '../models/leave.model';

@Injectable({ 
    providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:3001/leaves';

  constructor(private http: HttpClient) {}

  getLeavesByEmployee(employeeId: string): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}?employeeId=${employeeId}`);
  }

  createLeave(leave: Leave): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, leave);
  }

  updateLeave(id: string, leave: Leave): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}`, leave);
  }

  deleteLeave(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}