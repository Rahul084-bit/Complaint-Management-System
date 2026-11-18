import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint, Status } from './complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/complaints';

  getAll(status?: Status | ''): Observable<Complaint[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Complaint[]>(this.baseUrl, { params });
  }

  create(c: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.baseUrl, c);
  }

  updateStatus(id: number, status: Status): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.baseUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
