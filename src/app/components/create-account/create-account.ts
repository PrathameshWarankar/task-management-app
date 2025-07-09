import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [RouterLink, FormsModule, MatSnackBarModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccount {
  private httpClient = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  imageFileName = signal('Upload profile picture');
  user: User = { 'Id': '', 'FirstName': '', 'LastName': '', 'Email': '', 'Password': '', 'ConfirmPassword': '', 'ProfileImgPath': '' };
  passwordError: string = '';
  emailError: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFileName.set(file.name);
    }
  }

  @ViewChild('firstName') firstName!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef;

  checkLastName() {
    if (this.user.FirstName.trim() === '') {
      this.firstName.nativeElement.style.border = "1px solid red"
    } else {
      this.firstName.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  checkEmail() {
    this.checkLastName()

    if (this.user.LastName.trim() === '') {
      this.lastName.nativeElement.style.border = "1px solid red"
    } else {
      this.lastName.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  checkPassword() {
    this.checkEmail()

    if (this.user.Email.trim() === '') {
      this.email.nativeElement.style.border = "1px solid red"
    } else {
      this.email.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  checkConfirmPassword() {
    this.checkPassword()

    if (this.user.Password.trim() === '') {
      this.password.nativeElement.style.border = "1px solid red"
    } else {
      this.password.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  checkProfileImg() {
    this.checkConfirmPassword()

    if (this.user.Password.trim() === '') {
      this.confirmPassword.nativeElement.style.border = "1px solid red"
    } else {
      this.confirmPassword.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  passwordValidate() {
    if (this.user.Password !== this.user.ConfirmPassword) {
      this.passwordError = "Passwords do not match"
      return false;
    } else {
      this.passwordError = ''
      return true;
    }
  }

  passwordFormatValidate() {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    console.log(passwordPattern.test(this.user.Password) + ' ' + this.user.Password)
    if (passwordPattern.test(this.user.Password)) {
      this.passwordError = ''
      return true;
    }
    else {
      this.passwordError = "Password must be at least 8 characters long and include at least\none uppercase letter and one number"
      return false;
    }
  }

  emailValidate() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(this.user.Email)) {
      this.emailError = '';
      return true;
    } else {
      this.emailError = 'Invalid email format';
      return false
    }
  }

  onSubmit(form: NgForm) {
    this.checkProfileImg();

    if (!form.invalid && this.emailValidate() && this.passwordFormatValidate() && this.passwordValidate()) {
      this.user.Id = crypto.randomUUID();
      this.httpClient.post('https://localhost:7216/Home/CreateAccount', this.user, {
      }).subscribe({
        next: response => {
          console.log('Account created successfully');
          this.snackBar.open('Account created successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        },
        error: err => {
          if (err.error.message != undefined) {
            alert('Error creating account: ' + err.error.message);
          } else {
            alert('Error creating account. Please try again later.');
          }
        }
      });
    }
  }
}
