import { Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from './services/task.service';
import { TaskItem } from './models/task-item';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TaskFormComponent,
    TaskListComponent,
    ConfirmDialogComponent,
    AlertDialogComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  protected readonly tasks = signal<TaskItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.loading.set(true);
    this.taskService
      .getTasks()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(tasks => this.tasks.set(tasks));
  }

  protected onCreate(title: string): void {
    const normalized = title.trim().toLowerCase();
    const exists = this.tasks().some(t => t.title.trim().toLowerCase() === normalized);
    if (exists) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Duplicate task',
          message: 'A task with this title already exists.'
        }
      });
      return;
    }

    this.busy.set(true);
    this.taskService
      .createTask(title)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(task => {
        this.tasks.update(list => [task, ...list]);
        this.snackBar.open('Task created', 'Close', { duration: 2500 });
      });
  }

  protected onToggle(task: TaskItem): void {
    this.busy.set(true);
    this.taskService
      .toggleTask(task.id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe(updated => {
        this.tasks.update(list => list.map(t => (t.id === updated.id ? updated : t)));
        this.snackBar.open('Task updated', 'Close', { duration: 2000 });
      });
  }

  protected onDelete(task: TaskItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { taskTitle: task.title }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.busy.set(true);
      this.taskService
        .deleteTask(task.id)
        .pipe(finalize(() => this.busy.set(false)))
        .subscribe(() => {
          this.tasks.update(list => list.filter(t => t.id !== task.id));
          this.snackBar.open('Task removed', 'Close', { duration: 2500 });
        });
    });
  }
}
