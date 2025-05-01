import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, Observable, switchMap, throwError } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3001/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(Employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, Employee);
  }

  updateEmployee(id: string, Employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, Employee);
  }

  deleteEmployeeAndLeaves(id: string): Observable<void> {
    return this.http.get<any[]>(`http://localhost:3001/leaves?employeeId=${id}`).pipe(
      switchMap(leaves => forkJoin(
        leaves.map(leave => 
          this.http.delete(`http://localhost:3001/leaves/${leave.id}`)
        )
      )),
      switchMap(() => this.http.delete<void>(`http://localhost:3001/employees/${id}`)),
      catchError(error => {
        return throwError(() => new Error('Error: ', error));
      })
    );
  }
}