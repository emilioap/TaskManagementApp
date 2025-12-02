import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/task-item';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/tasks';

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }

  createTask(title: string): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, { title });
  }

  toggleTask(id: string): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
