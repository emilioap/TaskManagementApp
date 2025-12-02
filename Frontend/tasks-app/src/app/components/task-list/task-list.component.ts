import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { TaskItem } from '../../models/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDividerModule
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

        <mat-list *ngIf="!loading && tasks.length" class="task-list">
          <ng-container *ngFor="let task of tasks; let last = last">
            <mat-list-item class="task-row">
              <div class="row">
                <mat-slide-toggle
                  class="task-toggle"
                  color="primary"
                  [checked]="task.completed"
                  (change)="toggle.emit(task)"
                  [disabled]="loading"
                ></mat-slide-toggle>

                <div class="task-copy">
                  <div class="title" [class.completed]="task.completed">{{ task.title }}</div>
                </div>

                <button
                  mat-stroked-button
                  color="warn"
                  class="delete-btn"
                  aria-label="Delete task"
                  (click)="delete.emit(task)"
                >
                  <mat-icon fontIcon="delete" aria-hidden="true"></mat-icon>
                  Delete
                </button>
              </div>
            </mat-list-item>
            <mat-divider *ngIf="!last"></mat-divider>
          </ng-container>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: 100%;
      }

      mat-card-header {
        background: linear-gradient(120deg, #3949ab 0%, #7e57c2 100%);
        color: #fff;
        border-radius: 8px 8px 0 0;
        padding: 1rem 1.25rem;
      }

      mat-card-title,
      mat-card-subtitle {
        color: inherit;
      }

      mat-card {
        width: 100%;
        overflow: hidden;
      }

      .task-list {
        padding: 0;
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

      .task-row {
        padding: 0;
      }

      .row {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 0.75rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
      }

      .task-copy {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .title {
        font-weight: 600;
        font-size: 1rem;
      }

      .delete-btn {
        margin-left: auto;
        align-self: center;
        display: inline-flex;
        gap: 0.35rem;
        height: 36px;
        padding: 0 10px;
        min-width: 84px;
        line-height: 1;
        justify-content: center;
      }

      .delete-btn mat-icon {
        font-size: 18px;
      }

      .task-toggle {
        --mdc-switch-selected-handle-color: #2e7d32;
        --mdc-switch-selected-track-color: #a5d6a7;
        --mdc-switch-selected-hover-handle-color: #2e7d32;
        --mdc-switch-selected-hover-track-color: #a5d6a7;
        --mdc-switch-selected-pressed-handle-color: #1b5e20;
        --mdc-switch-selected-pressed-track-color: #8bc34a;
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
