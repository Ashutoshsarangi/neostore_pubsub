import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { BehaviourService } from '../../Services/behaviour.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { EmailValidator } from '@angular/forms';
//import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loggedIn: boolean; //To store the status on logged in.

  authorizationToken; //To store the authorization token.

  cartDataResponseObjectStringified; //To store the cart response object in stringified format.
  cartDataResponseObjectParsed; //To store the cart response object in parsed format.
  cartData; //To store the cart array.
  cartArray = []; //To store the cart data as [product_id, _id, quantity]
  cartCount; //To store the cart count.

  //user: SocialUser;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private behaviourService: BehaviourService,
    private auth: AuthService
    //private authService: AuthService
  ) { }

  ngOnInit() {
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    // });
    if (this.auth.isLoggedIn()) {
      Swal.fire("Already logged in");
      this.router.navigate(["categories-carousel"]);
    }
    else {
      if (document.forms["RegForm"]["email"] != null) {
        document.forms["RegForm"]["email"].focus();
      }
      if (document.forms["RegForm"]["password"] != null) {
        document.forms["RegForm"]["password"].focus();
      }
    }
  }

  formValidation() {

    var email = document.forms["RegForm"]["email"]; //User Email Field;
    var password = document.forms["RegForm"]["password"]; // User Password Field.

    //REGEX FOR VALIDATIONS.
    //var emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var emailValidationRegex = /^[A-Za-z]{2,}[A-Za-z0-9]{0,}[.]{0,1}[A-Za-z0-9]{1,}[.]{0,1}[A-Za-z0-9]{1,}@[A-Za-z]{2,}[.]{1}[A-za-z]{2,3}[.]{0,1}[a-z]{0,2}$/;
    var passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (email.value == "") {
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Please enter your email.";
      email.focus();
      return false;
    }

    if (!(emailValidationRegex.test(String(email.value).toLowerCase()))) {
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Enter correct email.";
      email.focus();
      return false;
    }

    if (password.value == "") {
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "* Please enter your password.";
      password.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(password.value)))) {
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "* The password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, 8-12 characters long.";
      password.focus();
      return false;
    }

    else {
      this.apiService.postLogin(email.value, password.value).subscribe((response) => {
        Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
        localStorage.setItem('loggedIn', "true");
        this.behaviourService.setLogin(localStorage.getItem('loggedIn'));
        localStorage.setItem('userDetails', JSON.stringify(response));
        this.auth.sendToken(JSON.parse(JSON.stringify(response)).token);
        this.getCustomerCartDetails();
        this.router.navigate(['categories-carousel']);
      },
        (error) => {
          Swal.fire('Oops...', error.error.message, 'error');
        });
      return true;
    }

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
      }, (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
    }
  }

  // signInWithFB(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  // signOutFromFB(): void {
  //   this.authService.signOut();
  // }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  // signOutFromGoogle(): void {
  //   this.authService.signOut();
  // }

  // openFacebook() {
  //   window.open('https://www.facebook.com/');
  // }

  // openGoogle() {
  //   window.open('https://www.google.com/intl/en-GB/gmail/about/#');
  // }

  // openTwitter() {
  //   window.open('https://twitter.com/login');
  // }

}