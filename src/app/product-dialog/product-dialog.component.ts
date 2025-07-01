import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RupiahPipe } from '../pipe/rupiah.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {} from '@angular/common/http';

@Component({
  standalone: true,
  imports:[MatDialogModule, MatFormFieldModule, MatInputModule,MatSnackBarModule,CommonModule,FormsModule,RouterModule],
    templateUrl: './product-dialog.component.html',
  styles: [`
    mat-form-field {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 2px 8px;
      display: inline-block;
    }
  `]
})
export class ProductDialogComponent {
  product = { name: '', price: null };

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.product = { ...data };
    }
  }

  isFormValid() {
    return this.product.name && this.product.price != null && this.product.price !== '';
  }

  save() {
    if (this.isFormValid()) {
      this.dialogRef.close(this.product);
    }
  }
}