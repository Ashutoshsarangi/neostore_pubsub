import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { BehaviourService } from '../../Services/behaviour.service';

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

  authorizationToken;

  cartDataResponseObjectStringified;
  cartDataResponseObjectParsed;
  cartData;
  cartCount;
  cartArray = [];

  orderDetails;
  deliveryAddress;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private behaviourService: BehaviourService
  ) { }

  ngOnInit() {
    this.imageUrl = environment.apiUrl;
    this.getCustomerCartDetails();
  }

  getCustomerCartDetails() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getCartData(this.authorizationToken).subscribe((data) => {
        this.cartDataResponseObjectStringified = (JSON.stringify(data));
        this.cartDataResponseObjectParsed = JSON.parse(this.cartDataResponseObjectStringified);
        this.cartData = this.cartDataResponseObjectParsed.product_details;
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
        if (!this.cartData) {
          this.noCartData = true;
        }
        else {
          this.noCartData = false;
          this.calculateReviewOrder(this.cartData);
          if (localStorage.getItem('loggedIn')) {
            this.apiService.getCustAddress(this.authorizationToken).subscribe((data) => {
              this.addresses = JSON.parse(JSON.stringify(data)).customer_address;
              this.noAddressFound = false;
              for (let i = 0; i < this.addresses.length; i++) {
                if (this.addresses[i].isDeliveryAddress == true) {
                  this.selectedRadio = JSON.stringify(i);
                  this.deliveryAddress = this.addresses[i].address_id;
                }
              }
            },
              (error) => {
                this.noAddressFound = true;
              });
          }
        }
      }, (error) => {
        window.alert(error.error.message);
      });
    }
  }

  calculateReviewOrder(cartDetails) {
    this.subtotal = 0;
    this.gst = 0;
    this.ordertotal = 0;
    for (let i = 0; i < cartDetails.length; i++) {
      this.subtotal = this.subtotal + JSON.parse(cartDetails[i].total_productCost);
    }
    this.gst = JSON.parse(((5 / 100) * this.subtotal).toFixed(2));
    this.ordertotal = this.subtotal + this.gst;
  }

  decrementQuanity(productId, currentQuantity, productCost, totalCost) {
    if (currentQuantity == 1) {
      window.alert("Quanity Cannot Be Less Than 1. You can delete the product if you want.");
    }
    else if (currentQuantity > 1) {
      for (let i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].product_id == productId) {
          this.cartData[i].quantity = currentQuantity - 1;
          this.cartData[i].total_productCost = JSON.parse(totalCost) - JSON.parse(productCost);
        }
      }
      localStorage.setItem('cartProduct', JSON.stringify(this.cartData));
      this.calculateReviewOrder(this.cartData);
    }
  }

  incrementQuanity(productId, currentQuantity, productCost, totalCost) {
    for (let i = 0; i < this.cartData.length; i++) {
      if (this.cartData[i].product_id == productId) {
        this.cartData[i].quantity = currentQuantity + 1;
        this.cartData[i].total_productCost = JSON.parse(totalCost) + JSON.parse(productCost);
      }
    }
    localStorage.setItem('cartProduct', JSON.stringify(this.cartData));
    this.calculateReviewOrder(this.cartData);
  }

  deleteProduct(productId) {
    for (let i = 0; i < this.cartData.length; i++) {
      if (this.cartData[i].product_id == productId) {
        this.cartData.splice(i, 1);
        if (this.cartData.length == 0) {
          localStorage.removeItem('cartProduct');
          localStorage.removeItem('cartCount');
          this.behaviourService.clearCount();
          this.noCartData = true;
        }
        else if (this.cartData.length != 0) {
          localStorage.setItem('cartProduct', JSON.stringify(this.cartData));
          var cartCount = JSON.parse(localStorage.getItem('cartCount'));
          localStorage.setItem('cartCount', JSON.stringify(cartCount - 1));
          this.behaviourService.setCount(JSON.stringify(cartCount - 1));
        }
      }
    }
    this.calculateReviewOrder(this.cartData);
    this.deleteCustomerCart(productId.product_id);
  }

  deleteCustomerCart(productId) {
    this.apiService.deleteCustomerCart(productId, this.authorizationToken).subscribe((data) => {

    },
      (error) => {

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
          window.alert(error.error.message);
          this.noAddressFound = true;
          this.selectedTab += 1;
          if (this.selectedTab >= 2) this.selectedTab = 0;
        });
    }
    else {
      window.alert("Please Login First.");
      this.router.navigate(['/login']);
    }
  }

  radioChange($event: MatRadioChange) {
    console.log("RADIO SLECTION")
    console.log($event);
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
          this.placeButtonColor = "#3D40A1";
          this.placeButtonTextColor = "#FFFFFF";
          this.placeOrderButton = true;
        }
      },
        (error) => {
          window.alert(error.error.message);
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
      window.alert("Please Login First.");
      this.router.navigate(['/login']);
    }
  }

  addToCartApi(result, authorizationToken) {
    this.apiService.postAddProductToCartCheckout(result, authorizationToken).subscribe((response) => {
      this.orderDetails = response;
      window.alert(this.orderDetails.message);
      localStorage.removeItem('cartProduct');
      localStorage.removeItem('cartCount');
      this.behaviourService.setCount("0");
      this.router.navigate(['/order-placed/', this.orderDetails.order_details[0].product_details.order_id, this.deliveryAddress]);
    },
      (error) => {
        window.alert(error.error.message);
      });
  }

  gotoEditAddress(address_id: any) {
    this.router.navigate(['/add-address/', address_id]);
  }

}