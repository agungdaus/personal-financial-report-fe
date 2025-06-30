import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule,MatSnackBarModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';

  constructor(private auth: AuthService,
            private snackBar: MatSnackBar,

  ) {
    
  }

  onLogin() {
    this.errorMsg = '';
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {},
      error: err => {
        if (err.status === 401) {
          this.errorMsg = 'Username atau password salah!';
        } else {
          this.errorMsg = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      }
    });
  }
  onRegister() {
            this.snackBar.open('Belum jadi Bang, daftar ke admin aja bayar gopek', 'Tutup',);


  }
}
