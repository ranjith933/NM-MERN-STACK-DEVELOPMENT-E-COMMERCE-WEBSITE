import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css']
})
export class AddCategoriesComponent {
  regForm: FormGroup;
  public isLoading = false;

  constructor(private http:HttpClient, private route:Router) {
    this.regForm  = new FormGroup({
      category:new FormControl(null,Validators.required),
    })
    
   }

   onSubmit(details={category:String}): void {
    this.isLoading = true;
    this.http.post('http://localhost:4200/add-category',details).subscribe((response) => {
      window.alert("Category Added Successfully!")
      this.regForm.reset();
      this.isLoading = false;
    })
  }
}
