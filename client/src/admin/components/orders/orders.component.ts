import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  public data: any[] = [];
  public isLoading = false;
  public orderId: string = '';
  public isUpdate = false;

  statusForm: FormGroup;

  constructor(private http: HttpClient, private route: Router,private modalService: NgbModal) {

    // Email Message to Customer //

    

    // Email Message to Customer //
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:4200/orders').subscribe(data => {
      this.data = data;
      this.isLoading = false;
    });
    
    this.statusForm  = new FormGroup({
      status:new FormControl('pending')
    })
  }

  onChangeStatus(id: string): void {
      this.orderId = id 
      this.isUpdate = true
  }
  

  onSubmit(status:String):void{
    this.http.put(`http://localhost:4200/orders/${this.orderId}`,status).subscribe((res)=>{
      window.alert('Order Status Updated!')
      this.isUpdate = false
      this.http.get<any[]>('http://localhost:4200/orders').subscribe(data => {
      this.data = data;
      this.isLoading = false;
    });
    })
  }
}
