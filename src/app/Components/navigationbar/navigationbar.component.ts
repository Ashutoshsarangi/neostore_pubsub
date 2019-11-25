import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BehaviourService } from '../../Services/behaviour.service';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SearchProductListComponent } from '../search-product-list/search-product-list.component';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {

  showProfileOption: boolean = false;
  subscription: Subscription;
  cartCount: string;
  authorizationToken;

  cartDataResponseObjectStringified;
  cartDataResponseObjectParsed;
  cartData;

  allProductsResponseObjectStringified; //All Products Response Object in Stringified Format.
  allProductsResponseObjectParsed; //All Products Response Object after Parsing.
  allProductsDetailsArray; //All Products Array.

  constructor(
    private router: Router,
    private behaviourService: BehaviourService,
    private apiService: ApiService,
    private auth: AuthService,
    private matDialog: MatDialog
  ) {
    this.subscription = this.behaviourService.getCount().subscribe(count => {
      if (count) {
        this.cartCount = count.value;
      } else {
        this.cartCount = null;
      }
    });
    this.subscription = this.behaviourService.getLogin().subscribe(login => {
      if (login) {
        if (login.value == "true") {
          this.showProfileOption = true;
        }
      } else {
        this.showProfileOption = false;
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem('loggedIn')) {
      this.showProfileOption = true;
      this.cartCount = JSON.parse(localStorage.getItem('cartCount'));
    } else {
      this.showProfileOption = false;
    }
    this.getAllProducts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openSearchProductList() {
    let dialogRef = this.matDialog.open(SearchProductListComponent, {
      width: '400px',
      height: '300px',
      data: {
        array: this.allProductsDetailsArray
      },
    });
    dialogRef.afterClosed().subscribe(value => {

    });
  }

  //Getting all products.
  getAllProducts() {
    localStorage.removeItem('category_id'); //Remove the Category Filter.
    localStorage.removeItem('color_id'); //Remove the Color Filter.
    localStorage.removeItem('sortBy'); //Remove the Product Rating and Ascending Filter.
    localStorage.removeItem('sortIn'); //Remove the Product Cost and Ascending/Descending Filter.
    this.apiService.getAllProducts().subscribe((data) => {
      this.allProductsResponseObjectStringified = (JSON.stringify(data));
      this.allProductsResponseObjectParsed = JSON.parse(this.allProductsResponseObjectStringified);
      if (this.allProductsResponseObjectParsed.success == true) {
        this.allProductsDetailsArray = this.allProductsResponseObjectParsed.product_details;
      }
      else if (this.allProductsResponseObjectParsed.success == false) {
        this.allProductsDetailsArray = [];
      }
    });
  }

  goToCart() {
    if (!this.auth.isLoggedIn()) {
      Swal.fire("Please Login First!");
      this.auth.logout();
    }
    else {
      this.router.navigate(["cart"]);
    }
  }

  gotoProfile(value) {
    if (localStorage.getItem('loggedIn')) {
      this.router.navigateByUrl('/profile', { skipLocationChange: true });
      setTimeout(() => this.router.navigate(['/profile/', value]));
    }
    else {
      Swal.fire("Please Login First");
      this.router.navigate(['/login']);
    }
  }

  logout() {
    if (!localStorage.getItem('loggedIn')) {
      Swal.fire("Please Login First.");
    }
    else {
      let dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '250px',
        data: {
          from: "Logout"
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(value => {
        this.showProfileOption = value;
      });
    }
  }

}