import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form class="task-form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline">
        <mat-label>New Task</mat-label>
        <input matInput placeholder="Enter a title" formControlName="title" />
        <mat-error *ngIf="form.controls.title.hasError('required')">Title is required</mat-error>
        <mat-error *ngIf="form.controls.title.hasError('minlength')">Minimum 3 characters</mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
        <mat-icon>add</mat-icon>
        Add
      </button>
    </form>
  `,
  styles: [
    `
      .task-form {
        display: flex;
        gap: 0.75rem;
        align-items: stretch;
      }

      mat-form-field {
        flex: 1;
        margin: 0;
      }

      button {
        height: 56px;
        align-self: stretch;
      }

      @media (max-width: 600px) {
        .task-form {
          flex-direction: column;
        }

        button {
          width: 100%;
        }
      }
    `
  ]
})
export class TaskFormComponent {
  @Output() create = new EventEmitter<string>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.create.emit(this.form.value.title!.trim());
    this.form.reset();
  }
}
