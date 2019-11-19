import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {

  order_id;
  deliveryAddress;
  authorizationToken;
  addresses = [];
  orderDeliverAddress;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.order_id = this.activatedRoute.snapshot.paramMap.get('order_id');
      this.deliveryAddress = this.activatedRoute.snapshot.paramMap.get('address_id');
      if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
        this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
        this.apiService.getCustAddress(this.authorizationToken).subscribe((data) => {
          this.addresses = JSON.parse(JSON.stringify(data)).customer_address;
          var newArray = this.addresses.filter(address =>
            address.address_id == this.deliveryAddress
          );
          this.orderDeliverAddress = newArray[0];
        },
          (error) => {
            Swal.fire('Oops...', error.error.message, 'error');
          });
      }
    }
    else {
      Swal.fire("Please Login First!");
      this.auth.logout();
    }
  }

}