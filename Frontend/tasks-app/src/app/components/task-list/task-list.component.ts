import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskItem } from '../../models/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Tasks</mat-card-title>
        <mat-card-subtitle *ngIf="tasks.length">{{ tasks.length }} total</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="loading" *ngIf="loading">
          <mat-spinner diameter="36"></mat-spinner>
        </div>

        <div *ngIf="!loading && tasks.length === 0" class="empty">
          No tasks yet. Add your first task above.
        </div>

        <mat-list *ngIf="!loading && tasks.length">
          <mat-list-item *ngFor="let task of tasks">
            <mat-checkbox
              color="primary"
              [checked]="task.completed"
              (change)="toggle.emit(task)"
              [disabled]="loading"
            >
              <span [class.completed]="task.completed">{{ task.title }}</span>
            </mat-checkbox>
            <button mat-icon-button color="warn" aria-label="Delete task" (click)="delete.emit(task)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: 100%;
      }

      mat-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .completed {
        text-decoration: line-through;
        color: rgba(0, 0, 0, 0.6);
      }

      .loading {
        display: flex;
        justify-content: center;
        padding: 1rem 0;
      }

      .empty {
        padding: 0.5rem 0;
        color: rgba(0, 0, 0, 0.6);
      }
    `
  ]
})
export class TaskListComponent {
  @Input() tasks: TaskItem[] = [];
  @Input() loading = false;
  @Output() toggle = new EventEmitter<TaskItem>();
  @Output() delete = new EventEmitter<TaskItem>();
}
