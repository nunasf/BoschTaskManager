import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  TaskService,
  Task,
} from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * TaskListComponent
 *
 * Displays the logged-in user's tasks and allows:
 * - listing tasks
 * - creating new tasks
 * - editing title/description
 * - toggling completion
 * - deleting tasks
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class TaskListComponent implements OnInit {
  // All tasks for the authenticated user
  tasks: Task[] = [];

  // Logged-in username
  username: string | null = null;

  // Loading states
  isLoading = false;
  isCreating = false;
  isSavingEdit = false; // specific loading flag for editing

  // Create task form state
  isCreateMode = false;
  newTaskTitle = '';
  newTaskDescription = '';

  // Edit task form state
  editingTaskId: number | null = null;
  editTitle = '';
  editDescription = '';

  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {

    // Reads the username stored in AuthService
    if (typeof this.authService.getUsername === 'function') {
      this.username = this.authService.getUsername();
    }

    // If you are not authenticated, return to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();
  }

  // Fetch tasks from the Flask backend
  private loadTasks(): void {
    this.isLoading = true;

    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks ?? [];
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load tasks:', err);
        this.isLoading = false;

        if (!this.tasks.length) {
          alert(
            'Failed to load tasks. Please check if you are logged in.',
          );
        }
      },
    });
  }

  // Toggle completed state and persist to backend
  toggleCompleted(taskId: number): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    // Optimistic UI update: marked as completed/uncompleted immediately
    task.completed = newCompleted;

    this.taskService.updateTaskCompletion(taskId, newCompleted).subscribe({
      error: (err: unknown) => {
        console.error('Failed to update completion state:', err);
        // Revert if backend fails
        task.completed = !newCompleted;
        alert('Failed to update task. Please try again.');
      },
    });
  }

  onToggleCompleted(taskId: number, event: any): void {
    this.toggleCompleted(taskId);

    // Fully remove focus from checkbox to hide the pink circle
    setTimeout(() => {
      const checkboxHost: HTMLElement = event.source._elementRef.nativeElement;
      checkboxHost.blur();
    });
  }

  // Enter/exit create new task mode.
  addTask(): void {
    this.isCreateMode = !this.isCreateMode;

    if (this.isCreateMode) {
      // Clear the form when opening
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }

  // Create a new task, then update the UI immediately
  createTask(): void {
    const title = this.newTaskTitle.trim();
    const description = this.newTaskDescription.trim();

    if (!title) {
      alert('Title is required.');
      return;
    }

    this.isCreating = true;

    // Use the original signature
    this.taskService.createTask(title, description).subscribe({
      next: (response: any) => {
        // Backend returns
        const newTask: Task = {
          id: response.id,
          title,
          description,
          completed: false,
        };

        // Add to current list
        this.tasks = [...this.tasks, newTask];

        // Reset and close form
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.isCreating = false;
        this.isCreateMode = false;

        // Sync with backend again
        this.loadTasks();
      },
      error: (err: unknown) => {
        console.error('Failed to create task:', err);
        this.isCreating = false;
        alert('Failed to create task. Please try again.');
      },
    });
  }

  /**
   * Start editing a specific task.
   * Copies current title/description into local edit fields.
   */
  startEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.editTitle = task.title;
    this.editDescription = task.description ?? '';
  }

  // Cancel editing mode and clear edit fields
  cancelEdit(): void {
    this.editingTaskId = null;
    this.editTitle = '';
    this.editDescription = '';
    this.isSavingEdit = false;
  }

  // Save edits for a task
  saveEdit(taskId: number): void {
    // Basic guard: don't save empty title
    if (!this.editTitle || !this.editTitle.trim()) {
      return;
    }

    this.isSavingEdit = true;

    const payload = {
      title: this.editTitle.trim(),
      description: (this.editDescription || '').trim(),
    };

    this.taskService.updateTask(taskId, payload).subscribe({
      next: () => {
        // After a successful update, reload tasks from backend
        this.loadTasks();

        // Exit edit mode and reset edit fields
        this.editingTaskId = null;
        this.editTitle = '';
        this.editDescription = '';

        this.isSavingEdit = false;
      },
      error: (err: any) => {
        console.error('Failed to update task:', err);
        this.isSavingEdit = false;
      },
    });
  }

  // Delete a task permanently
  deleteTask(taskId: number): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const confirmed = confirm(
      `Are you sure you want to delete the task "${task.title}"?`,
    );
    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        // Remove from local list
        this.tasks = this.tasks.filter((t) => t.id !== taskId);

        // If we were editing this task, exit edit mode
        if (this.editingTaskId === taskId) {
          this.cancelEdit();
        }
      },
      error: (err: unknown) => {
        console.error('Failed to delete task:', err);
        alert('Failed to delete task. Please try again.');
      },
    });
  }

  // Logout the current user and return to the login page
  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
