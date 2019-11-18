import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  address_id;
  addressHeading = "Add new address";
  buttonText = "Save";
  addresses = [];

  authorizationToken;

  ordersClicked: boolean = false;
  myAccountClicked: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    if(this.auth.isLoggedIn()) {
      console.log("CHECKING URL FOR ADD TO ADDESSS");
      console.log(this.router.url);
      this.address_id = this.activatedRoute.snapshot.paramMap.get('address_id');
      if ((this.router.url === '/add-address/' + this.address_id) || (this.router.url === '/profile/add-address/' + this.address_id)) {
        this.addressHeading = "Edit Address";
        this.buttonText = "Update";
        if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
          this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
          this.apiService.getCustAddress(this.authorizationToken).subscribe((data) => {
            this.addresses = JSON.parse(JSON.stringify(data)).customer_address;
            var newArray = this.addresses.filter(address =>
              address.address_id == this.address_id
            );
            document.forms["RegForm"]["address"].value = newArray[0].address;
            document.forms["RegForm"]["pin"].value = newArray[0].pincode;
            document.forms["RegForm"]["city"].value = newArray[0].city;
            document.forms["RegForm"]["state"].value = newArray[0].state;
            document.forms["RegForm"]["country"].value = newArray[0].country;
          },
            (error) => {
              Swal.fire('Oops...', error.error.message, 'error');
            });
        }
      }
    }
    else {
      this.auth.logout();
      Swal.fire("Please Login First!");
    }
  }

  save(value) {

    var address = document.forms["RegForm"]["address"]; //User Address.
    var pin = document.forms["RegForm"]["pin"]; //User Pincode.
    var city = document.forms["RegForm"]["city"]; //User City.
    var state = document.forms["RegForm"]["state"]; //User State.
    var country = document.forms["RegForm"]["country"]; //User Country.

    //REGEX FOR VALIDATIONS.
    var pinValidationRegex = /^[1-9][0-9]{5}$/;
    var cityStateCountryValidationRegex = /^[A-Za-z]+$/;

    if (address.value == "") {
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("address_error").innerHTML = "* Please enter your address.";
      address.focus();
      return false;
    }

    if (address.value.length > 100) {
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("address_error").innerHTML = "* Address cannot be more than 100 characters.";
      address.focus();
      return false;
    }

    if (pin.value == "") {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "* Please enter your pin code.";
      pin.focus();
      return false;
    }

    if (!(pinValidationRegex.test(String(pin.value)))) {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "* Enter correct pin code.";
      pin.focus();
      return false;
    }

    if (city.value == "") {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "* Please enter your city.";
      city.focus();
      return false;
    }

    if (!(cityStateCountryValidationRegex.test(String(city.value).replace(/\s/g, "")))) {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "* Enter correct city name.";
      city.focus();
      return false;
    }

    if (state.value == "") {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "* Please enter your state.";
      state.focus();
      return false;
    }

    if (!(cityStateCountryValidationRegex.test(String(state.value).replace(/\s/g, "")))) {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "* Enter correct state name.";
      state.focus();
      return false;
    }

    if (country.value == "") {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "* Please enter your country.";
      country.focus();
      return false;
    }

    if (!(cityStateCountryValidationRegex.test(String(country.value).replace(/\s/g, "")))) {
      document.getElementById("address_error").innerHTML = "";
      document.getElementById("pin_error").innerHTML = "";
      document.getElementById("city_error").innerHTML = "";
      document.getElementById("state_error").innerHTML = "";
      document.getElementById("country_error").innerHTML = "* Enter correct country name.";
      country.focus();
      return false;
    }

    else {
      if (this.router.url === '/profile/add-address/' + this.address_id || this.router.url === '/add-address/' + this.address_id) {
        if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
          this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
          this.apiService.putUpdateAddress(this.address_id, address.value, pin.value, city.value, state.value, country.value, false, this.authorizationToken).subscribe((response) => {
            Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
            if (this.router.url === "/cart/add-address") {
              this.router.navigate(['/cart'])
            }
            else {
              this.router.navigate(['/profile/', value]);
            }
          },
            (error) => {
              Swal.fire('Oops...', error.error.message, 'error');
              this.cancel(value);
            });
          return true;
        }
      }
      else {
        if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
          this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
          this.apiService.postAddress(address.value, pin.value, city.value, state.value, country.value, this.authorizationToken).subscribe((response) => {
            Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
            if (this.router.url === "/cart/add-address") {
              this.router.navigate(['/cart'])
            }
            else {
              this.router.navigate(['/profile/', value]);
            }
          },
            (error) => {
              Swal.fire('Oops...', error.error.message, 'error');
              this.cancel(value);
            });
          return true;
        }
      }
    }
  }

  cancel(value) {
    this.router.navigate(['/profile/', value]);
  }

  openOrdersList() {
    if (this.ordersClicked == false) {
      this.ordersClicked = true;
      this.myAccountClicked = false;
    }
    else if (this.ordersClicked == true) {
      this.ordersClicked = false;
    }
  }

  openMyAccountList() {
    if (this.myAccountClicked == false) {
      this.myAccountClicked = true;
      this.ordersClicked = false;
    }
    else if (this.myAccountClicked == true) {
      this.myAccountClicked = false;
    }
  }

  gotoProfile(value) {
    if (localStorage.getItem('loggedIn')) {
      this.router.navigateByUrl('/profile', { skipLocationChange: true });
      setTimeout(() => this.router.navigate(['/profile/', value]));
    }
    else {
      Swal.fire('Oops...', "Please Login First !!", 'error');
      this.router.navigate(['/login']);
    }
  }

}