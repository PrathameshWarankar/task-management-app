import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-account',
  imports: [RouterLink],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccount {

  imageFileName = signal('Upload profile picture');

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFileName.set(file.name);
    }
  }
}
