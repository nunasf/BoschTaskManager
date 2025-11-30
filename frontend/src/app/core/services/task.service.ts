import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Task model matching the Flask backend.
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * TaskService
 *
 * Talk to Flask /api/tasks endpoints
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:500/api';

  constructor(private readonly http: HttpClient) {}

  /**
   * GET /api/tasks/
   * Fetch all tasks for the authenticated user
   */
  getTasks(): Observable<Task[]> {
    const url = `${this.apiUrl}/tasks/`;
    return this.http.get<Task[]>(url);
  }

  /**
   * POST /api/tasks/
   *
   * Backend returns: { id, message }
   */
  createTask(title: string, description: string): Observable<any> {
    const url = `${this.apiUrl}/tasks/`;
    const body = { title, description };
    return this.http.post<any>(url, body);
  }

  /**
   * PUT /api/tasks/<id>
   * Update the completed flag of a task
   */
  updateTaskCompletion(
    id: number,
    completed: boolean,
  ): Observable<Task> {
    const url = `${this.apiUrl}/tasks/${id}`;
    const body = { completed };
    return this.http.put<Task>(url, body);
  }

  /**
   * DELETE /api/tasks/<id>
   * Remove a task permanently for the authenticated user
   */
  deleteTask(id: number): Observable<any> {
    const url = `${this.apiUrl}/tasks/${id}`;
    return this.http.delete<any>(url);
  }

  /**
   * PUT /api/tasks/<id>
   * Update the task's title and description
   */
  updateTaskDetails(
    id: number,
    title: string,
    description: string,
  ): Observable<Task> {
    const url = `${this.apiUrl}/tasks/${id}`;
    const body = { title, description };
    return this.http.put<Task>(url, body);
  }

  updateTask(
    id: number,
    data: { title: string; description: string }
  ) {
    // PUT /api/tasks/<id> with the updated fields
    return this.http.put<any>(`${this.apiUrl}/tasks/${id}`, data);
  }
}
