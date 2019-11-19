import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { BehaviourService } from '../../Services/behaviour.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  imageUrl;
  noCartData: boolean = true;

  subtotal = 0;
  gst = 0;
  ordertotal = 0;

  noAddressFound: boolean = true;

  selectedTab = 0;

  addresses = [];

  selectedRadio: string;

  placeButtonColor = "#DEDEDE";
  placeButtonTextColor = "#A3A3A3";
  placeOrderButton: boolean = false;
  placeButtonBorder = "2px solid #DEDEDE";

  authorizationToken;

  cartDataResponseObjectStringified;
  cartDataResponseObjectParsed;
  cartData;
  cartCount;
  cartArray = [];

  orderDetails;
  deliveryAddress;
  cartDataUIBackup;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private behaviourService: BehaviourService,
    private auth: AuthService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.imageUrl = environment.apiUrl;
      this.getCustomerCartDetails();
    }
    else {
      this.auth.logout();
      Swal.fire("Please Login First!");
    }
  }

  getCustomerCartDetails() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getCartData(this.authorizationToken).subscribe((data) => {
        this.cartDataResponseObjectStringified = (JSON.stringify(data));
        this.cartDataResponseObjectParsed = JSON.parse(this.cartDataResponseObjectStringified);
        this.cartData = this.cartDataResponseObjectParsed.product_details;
        if (!this.cartData) {
          this.noCartData = true;
        }
        else {
          this.noCartData = false;
          this.cartDataUIBackup = this.cartData;
          this.cartCount = this.cartData.length;
          this.behaviourService.setCount(this.cartCount);
          localStorage.setItem('cartCount', JSON.stringify(this.cartCount));
          for (let i = 0; i < this.cartData.length; i++) {
            this.cartArray[i] = {
              product_id: this.cartData[i].product_id.product_id,
              _id: this.cartData[i].product_id._id,
              quantity: this.cartData[i].quantity
            }
          }
          localStorage.setItem('cartProduct', JSON.stringify(this.cartArray));
          this.calculateReviewOrder(this.cartData, "OnInit");
          if (localStorage.getItem('loggedIn')) {
            this.apiService.getCustAddress(this.authorizationToken).subscribe((data) => {
              this.addresses = JSON.parse(JSON.stringify(data)).customer_address;
              this.noAddressFound = false;
              for (let i = 0; i < this.addresses.length; i++) {
                if (this.addresses[i].isDeliveryAddress == true) {
                  this.selectedRadio = JSON.stringify(i);
                  this.deliveryAddress = this.addresses[i].address_id;
                  this.placeButtonColor = "#4A3DB5";
                  this.placeButtonTextColor = "#FFFFFF";
                  this.placeButtonBorder = "2px solid #000000";
                  this.placeOrderButton = true;
                }
              }
            },
              (error) => {
                this.noAddressFound = true;
              });
          }
        }
      }, (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
    }
  }

  calculateReviewOrder(cartDetails, value) {
    this.subtotal = 0;
    this.gst = 0;
    this.ordertotal = 0;
    if (value == "IncreDecre") {
      if (this.cartDataUIBackup.length == cartDetails.length) {
        for (let i = 0; i < cartDetails.length; i++) {
          if (this.cartDataUIBackup[i].product_id.product_id == cartDetails[i].product_id) {
            this.subtotal = this.subtotal + JSON.parse(this.cartDataUIBackup[i].total_productCost);
          }
        }
      }
    }
    if (value == "Delete" || value == "OnInit") {
      if (this.cartDataUIBackup.length == cartDetails.length) {
        for (let i = 0; i < cartDetails.length; i++) {
          if (this.cartDataUIBackup[i].product_id == cartDetails[i].product_id) {
            this.subtotal = this.subtotal + JSON.parse(this.cartDataUIBackup[i].total_productCost);
          }
        }
      }
    }
    this.gst = JSON.parse(((5 / 100) * this.subtotal).toFixed(2));
    this.ordertotal = this.subtotal + this.gst;
  }

  decrementQuanity(productId, currentQuantity, productCost, totalCost) {
    if (currentQuantity == 1) {
      Swal.fire("Quanity Cannot Be Less Than 1. You can delete the product if you want.");
    }
    else if (currentQuantity > 1) {
      var storageCart = JSON.parse(localStorage.getItem('cartProduct'));
      for (let i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].product_id == productId) {
          this.cartData[i].quantity = currentQuantity - 1;
          storageCart[i].quantity = currentQuantity - 1;
          this.cartData[i].total_productCost = JSON.parse(totalCost) - JSON.parse(productCost);
        }
      }
      localStorage.setItem('cartProduct', JSON.stringify(storageCart));
      this.calculateReviewOrder(storageCart, "IncreDecre");
    }
  }

  incrementQuanity(productId, currentQuantity, productCost, totalCost) {
    if (currentQuantity >= 10) {
      Swal.fire("Quanity Cannot Be Greater Than 10.");
    }
    else {
      var storageCart = JSON.parse(localStorage.getItem('cartProduct'));
      for (let i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].product_id == productId) {
          this.cartData[i].quantity = currentQuantity + 1;
          storageCart[i].quantity = currentQuantity + 1;
          this.cartData[i].total_productCost = JSON.parse(totalCost) + JSON.parse(productCost);
        }
      }
      localStorage.setItem('cartProduct', JSON.stringify(storageCart));
      this.calculateReviewOrder(storageCart, "IncreDecre");
    }
  }

  deleteProduct(productId) {
    let dialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '250px',
      data: {
        from: "Cart"
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        for (let i = 0; i < this.cartData.length; i++) {
          if (this.cartData[i].product_id == productId) {
            this.cartData.splice(i, 1);
            this.cartDataUIBackup = this.cartData;
            var storageCart = JSON.parse(localStorage.getItem('cartProduct'));
            storageCart.splice(i, 1);
            if (this.cartData.length == 0) {
              localStorage.removeItem('cartProduct');
              localStorage.removeItem('cartCount');
              this.behaviourService.clearCount();
              this.noCartData = true;
            }
            else if (this.cartData.length != 0) {
              localStorage.setItem('cartProduct', JSON.stringify(storageCart));
              var cartCount = JSON.parse(localStorage.getItem('cartCount'));
              localStorage.setItem('cartCount', JSON.stringify(cartCount - 1));
              this.behaviourService.setCount(JSON.stringify(cartCount - 1));
            }
          }
        }
        this.deleteCustomerCart(productId.product_id);
      }
      else {
        Swal.fire("Your Product is not deleted!");
      }
    });
  }

  deleteCustomerCart(productId) {
    this.apiService.deleteCustomerCart(productId, this.authorizationToken).subscribe((response) => {
      Swal.fire("Deleted!", JSON.parse(JSON.stringify(response)).message, "success");
      this.calculateReviewOrder(this.cartData, "Delete");
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

  proceedToBuy() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getCustAddress(this.authorizationToken).subscribe((data) => {
        this.addresses = JSON.parse(JSON.stringify(data)).customer_address;
        this.noAddressFound = false;
        for (let i = 0; i < this.addresses.length; i++) {
          if (this.addresses[i].isDeliveryAddress == true) {
            this.selectedRadio = JSON.stringify(i);
          }
        }
        this.selectedTab += 1;
        if (this.selectedTab >= 2) this.selectedTab = 0;
      },
        (error) => {
          Swal.fire('Oops...', error.error.message, 'error');
          this.noAddressFound = true;
          this.selectedTab += 1;
          if (this.selectedTab >= 2) this.selectedTab = 0;
        });
    }
    else {
      Swal.fire('Oops...', "Please Login First.", 'error');
      this.router.navigate(['/login']);
    }
  }

  radioChange($event: MatRadioChange) {
    for (let i = 0; i < this.addresses.length; i++) {
      if ($event.source.name == JSON.stringify(i)) {
        this.selectedRadio = $event.value;
        this.deliveryAddress = this.addresses[i].address_id;
        this.setDeliveryAddress(this.addresses[i], true);
      }
      else {
        this.setDeliveryAddress(this.addresses[i], false)
      }
    }
  }

  setDeliveryAddress(address, value) {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.putUpdateAddress(address.address_id, address.address, address.pincode, address.city, address.state, address.country, value, this.authorizationToken).subscribe((response) => {
        if (response) {
          this.placeButtonColor = "#4A3DB5";
          this.placeButtonTextColor = "#FFFFFF";
          this.placeOrderButton = true;
          this.placeButtonBorder = "2px solid #000000";
        }
      },
        (error) => {
          Swal.fire('Oops...', error.error.message, 'error');
        });
    }
  }

  placeOrder() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      if (localStorage.getItem('cartCount') && localStorage.getItem('cartProduct')) {
        var cartCount = JSON.parse(localStorage.getItem('cartCount'));
        var a = [];
        a = JSON.parse(localStorage.getItem('cartProduct'));
        var obj = {
          flag: "checkout"
        };
        a.push(obj);
        this.addToCartApi(a, this.authorizationToken);
      }
    }
    else {
      Swal.fire('Oops...', "Please Login First.", 'error');
      this.router.navigate(['/login']);
    }
  }

  addToCartApi(result, authorizationToken) {
    this.apiService.postAddProductToCartCheckout(result, authorizationToken).subscribe((response) => {
      this.orderDetails = response;
      Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
      localStorage.removeItem('cartProduct');
      localStorage.removeItem('cartCount');
      this.behaviourService.setCount("0");
      this.router.navigate(['/order-placed/', this.orderDetails.order_details[0].product_details.order_id, this.deliveryAddress]);
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

  gotoEditAddress(address_id: any) {
    this.router.navigate(['/add-address/', address_id]);
  }

  gotoProductDetails(productId: any) {
    this.router.navigate(['/productdetails/', productId]);
  }

}