import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private httpClient = inject(HttpClient)
  private router: Router = inject(Router);
  private snackBar = inject(MatSnackBar);

  login_email: string = '';
  login_password: string = '';

  @ViewChild('email') emailId!: ElementRef;
  @ViewChild('password') pass!: ElementRef;

  checkEmail() {
    if (this.login_email === '') {
      this.emailId.nativeElement.style.border = "1px solid red"
    } else {
      this.emailId.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  checkFields() {
    this.checkEmail();

    if (this.login_password === '') {
      this.pass.nativeElement.style.border = "1px solid red"
    } else {
      this.pass.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  onLogin(form: NgForm) {
    this.checkFields();

    const params = new HttpParams().set('email', this.login_email).set('password', this.login_password)

    if (!form.invalid) {
      this.httpClient.get('https://localhost:7216/Home/LoginUser', { params }).subscribe({
        next: res => {
          console.log('Login success')
          console.log(res)
          this.snackBar.open('Login success', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });

          setTimeout(() => {
            this.router.navigate(['/main-page']);
          }, 500);
        },
        error: err => {
          console.log(err)
          if (err.error.message != undefined) {
            alert(err.error.message);

            if (err.error.message.includes('create a new account')) {
              this.router.navigate(['/create-account']);
            }
          } else {
            alert('Error while login. Please try again later.');
          }
        }
      })
    }
  }
}
