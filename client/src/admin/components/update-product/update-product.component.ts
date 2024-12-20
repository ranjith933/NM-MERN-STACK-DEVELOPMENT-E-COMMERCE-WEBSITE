import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {
  public data: any[] = [];
  public isLoading = false;
  regForm: FormGroup;

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    this.regForm = new FormGroup({
      productname: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      brand: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      countInStock: new FormControl(null, Validators.required),
      rating: new FormControl(null, Validators.required),
    });
    
  }

  onUpdate(productDetails: {
    productname: string;
    description: string;
    price: string;
    brand: string;
    image: string;
    category: string;
    countInStock: string;
    rating: string;
  }): void {
    this.isLoading = true;
    const productId = this.route.snapshot.paramMap.get('id');
    this.http
      .put(`http://localhost:4200/products/${productId}`, productDetails)
      .subscribe((res) => {
        if (res) {
          window.alert('Product Updated Successfully!');
          this.router.navigate(['/admin/home'])
          this.http
            .get<any[]>('http://localhost:4200/products')
            .subscribe((data) => {
              this.data = data;
              this.isLoading = false;
            });
        }
      });
  }
}
