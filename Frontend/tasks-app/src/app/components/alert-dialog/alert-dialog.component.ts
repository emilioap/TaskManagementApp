import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>Ok</button>
    </mat-dialog-actions>
  `
})
export class AlertDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}
