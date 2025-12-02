import { Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from './services/task.service';
import { TaskItem } from './models/task-item';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    TaskFormComponent,
    TaskListComponent,
    ConfirmDialogComponent
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
    this.loading.set(true);
    this.taskService
      .createTask(title)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(task => {
        this.tasks.update(list => [task, ...list]);
        this.snackBar.open('Task created', 'Close', { duration: 2500 });
      });
  }

  protected onToggle(task: TaskItem): void {
    this.taskService.toggleTask(task.id).subscribe(updated => {
      this.tasks.update(list => list.map(t => (t.id === updated.id ? updated : t)));
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

      this.taskService.deleteTask(task.id).subscribe(() => {
        this.tasks.update(list => list.filter(t => t.id !== task.id));
        this.snackBar.open('Task removed', 'Close', { duration: 2500 });
      });
    });
  }
}
