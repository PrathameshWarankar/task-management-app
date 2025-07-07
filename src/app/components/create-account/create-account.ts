import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccount {
  private httpClient = inject(HttpClient);
  imageFileName = signal('Upload profile picture');
  user: User = { 'Id': '', 'FirstName': '', 'LastName': '', 'Email': '', 'Password': '', 'ConfirmPassword': '', 'ProfileImgPath': '' };
  passwordError: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFileName.set(file.name);
    }

    console.log(this.imageFileName())
  }

  @ViewChild('firstName') firstName!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef;

  isInvalid(value: string): boolean {
    return value.trim() === '';
  }

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

  checkProfileImg(){
    this.checkConfirmPassword()

        if (this.user.Password.trim() === '') {
      this.confirmPassword.nativeElement.style.border = "1px solid red"
    } else {
      this.confirmPassword.nativeElement.style.border = "1px solid #212a3e"
    }
  }

  passwordValidate(){
      if(this.user.Password !== this.user.ConfirmPassword){
          this.passwordError = "Passwords do not match"
      } else {
        this.passwordError = ''
      }
  }

  onSubmit(form: NgForm) {
    this.checkLastName();
    this.checkEmail();
    this.checkPassword();
    this.checkConfirmPassword();
    this.checkProfileImg();

    if (!form.invalid) {
      this.user.Id = crypto.randomUUID();
      this.httpClient.post('https://localhost:7216/Home/CreateAccount', this.user, {
      }).subscribe({
        next: response => {
          console.log('Account created successfully');
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
