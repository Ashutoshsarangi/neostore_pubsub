import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatRadioChange } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  selectedButton;

  noAddressFound: boolean = true;
  noOrderFound: boolean = true;

  orderDetails;
  orderDetailsArray;
  orderDetailsPdf;

  profileDetails;
  profileDetailsObject;

  addresses = [];

  imageUrl; //Base API Url.
  pdfUrl; //Base API Url.

  authorizationToken;

  editProfileClicked: boolean = false;

  gender: string;

  customerName;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  profile_img;

  todaysDate;

  passwordType1 = "password";
  passwordType2 = "password";
  passwordType3 = "password";

  today;
  maxYear;
  maxMonth;
  maxDay;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private router: Router,
    private auth: AuthService,
    private matDialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.todaysDate = formatDate(new Date(), 'yyyy-mm-dd', 'en');
      this.imageUrl = environment.apiUrl; //Getting the base API Url from environment.ts file.
      this.pdfUrl = environment.apiUrl; //Getting the base API Url from environment.ts file.
      if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
        this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
        this.apiService.getCustProfile(this.authorizationToken).subscribe((response) => {
          this.profileDetails = response;
          if (this.profileDetails.customer_proile) {
            this.profileDetailsObject = this.profileDetails.customer_proile;
            this.customerName = this.profileDetailsObject.first_name + " " + this.profileDetailsObject.last_name;
          }
        },
          (error) => {

          });
      }
      this.selectedButton = this.activatedRoute.snapshot.paramMap.get('option');
      if (this.selectedButton == "Order") {
        this.openOrder("Order");
      }
      else if (this.selectedButton == "Profile") {
        this.openProfile("Profile");
      }
      else if (this.selectedButton == "Address") {
        this.openAddress("Address");
      }
    }
    else {
      Swal.fire("Please Login First!");
      this.auth.logout();
    }
  }

  openOrder(Order) {
    this.selectedButton = "Order";
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getOrderDetails(this.authorizationToken).subscribe((response) => {
        this.orderDetails = response;
        if (this.orderDetails.product_details.length == 0) {
          this.noOrderFound = true;
        }
        else if (this.orderDetails.product_details.length != 0) {
          this.noOrderFound = false;
          this.orderDetailsArray = this.orderDetails.product_details;
          this.orderDetailsArray.sort(function (a, b) {
            var dateA = new Date(a.product_details[0].createdAt),
              dateB = new Date(b.product_details[0].createdAt)
            return Number(dateB) - Number(dateA);
          });
        }
      },
        (error) => {
          this.noOrderFound = true;
        });
      this.router.navigate(['/profile/', Order]);
    }
  }

  downloadOrderPdf(orderObject) {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getInvoiceOfOrder(orderObject, this.authorizationToken).subscribe((response) => {
        this.orderDetailsPdf = response;
        window.open(this.pdfUrl + this.orderDetailsPdf.receipt);
      },
        (error) => {

        });
    }
  }

  openProfile(Profile) {
    this.editProfileClicked = false;
    this.selectedButton = "Profile";
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getCustProfile(this.authorizationToken).subscribe((response) => {
        this.profileDetails = response;
        if (this.profileDetails.customer_proile) {
          this.profileDetailsObject = this.profileDetails.customer_proile;
          this.customerName = this.profileDetailsObject.first_name + " " + this.profileDetailsObject.last_name;
        }
      },
        (error) => {

        });
      this.router.navigate(['/profile/', Profile]);
    }
  }

  gotoEditProfile() {
    this.editProfileClicked = true;
    this.today = new Date();
    this.maxDay = this.today.getDate();
    this.maxMonth = this.today.getMonth() + 1;
    this.maxYear = this.today.getFullYear();
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getCustProfile(this.authorizationToken).subscribe((response) => {
        this.profileDetails = response;
        if (this.profileDetails.customer_proile) {
          this.profileDetailsObject = this.profileDetails.customer_proile;
          document.forms["RegForm"]["firstname"].value = this.profileDetailsObject.first_name;
          document.forms["RegForm"]["lastname"].value = this.profileDetailsObject.last_name;
          this.gender = this.profileDetailsObject.gender;
          if (this.profileDetailsObject.dob != null || this.profileDetailsObject.dob != "" || this.profileDetailsObject.dob != undefined) {
            document.forms["RegForm"]["dob"].value = this.profileDetailsObject.dob;
          } else {
            document.forms["RegForm"]["dob"].value = "N.A.";
          }
          document.forms["RegForm"]["mobile"].value = this.profileDetailsObject.phone_no;
          document.forms["RegForm"]["email"].value = this.profileDetailsObject.email;
        }
      },
        (error) => {

        });
    }
  }

  radioChange($event: MatRadioChange) {
    this.gender = $event.value;
  }

  dateSelection(event) {

  }

  fileProgress(event) {
    this.fileData = event.target.files[0] || event.dataTransfer.files;
    this.profile_img = event.target.files[0];
  }

  // preview() {
  //   var mimeType = this.fileData.type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     return;
  //   }
  //   var reader = new FileReader();
  //   reader.readAsDataURL(this.fileData);
  //   reader.onload = (_event) => {
  //     this.previewUrl = reader.result;
  //   }
  // }

  save(value) {

    var firstname = document.forms["RegForm"]["firstname"]; //User First Name Field;
    var lastname = document.forms["RegForm"]["lastname"]; //User Last Name Field;
    var mobile = document.forms["RegForm"]["mobile"]; //User Mobile Number Field.
    var email = document.forms["RegForm"]["email"]; //User Email Field;
    var dob = document.forms["RegForm"]["dob"]; //User Dob;

    //REGEX FOR VALIDATIONS.
    var nameValidationRegex = /^[A-Za-z]+$/;
    var dateValidationRegex = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
    //var emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var emailValidationRegex = /^[A-Za-z]{2,}[A-Za-z0-9]{0,}[.]{0,1}[A-Za-z0-9]{1,}[.]{0,1}[A-Za-z0-9]{1,}@[A-Za-z]{2,}[.]{1}[A-za-z]{2,3}[.]{0,1}[a-z]{0,2}$/;
    var mobileValidationRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

    if (firstname.value == "") {
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("firstname_error").innerHTML = "* Please enter your first name.";
      firstname.focus();
      return false;
    }

    if (!(nameValidationRegex.test(String(firstname.value)))) {
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("firstname_error").innerHTML = "* Enter correct first name.";
      firstname.focus();
      return false;
    }

    if (lastname.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "* Please enter your last name.";
      lastname.focus();
      return false;
    }

    if (!(nameValidationRegex.test(String(lastname.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "* Enter correct last name.";
      lastname.focus();
      return false;
    }

    if (this.gender == "" || this.gender == null || this.gender == undefined) {
      Swal.fire("Please select a Gender.");
      return false;
    }

    if (dob.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "* Please enter your dob.";
      dob.focus();
      return false;
    }

    if (!(dateValidationRegex.test(String(dob.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "* Please enter correct dob.";
      dob.focus();
      return false;
    }

    if (mobile.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "* Please enter your mobile number.";
      mobile.focus();
      return false;
    }

    if (!(mobileValidationRegex.test(String(mobile.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "* Enter correct mobile number.";
      mobile.focus();
      return false;
    }

    if (email.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Please enter your email.";
      email.focus();
      return false;
    }

    if (!(emailValidationRegex.test(String(email.value).toLowerCase()))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("dob_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Enter correct email.";
      email.focus();
      return false;
    }

    else {
      if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
        this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
        var firstname = document.forms["RegForm"]["firstname"].value;
        var lastname = document.forms["RegForm"]["lastname"].value;
        var email = document.forms["RegForm"]["email"].value;
        var dob = document.forms["RegForm"]["dob"].value;
        var mobile = document.forms["RegForm"]["mobile"].value;
        const formData = new FormData();
        formData.append('profile_img', this.profile_img);
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('email', email);
        formData.append('dob', dob);
        formData.append('phone_no', mobile);
        formData.append('gender', this.gender);
        console.log("------IN PROFILE COMPONENT-------");
        console.log(formData);
        formData.forEach((value, key) => {
          console.log(key + " " + value)
        });
        this.apiService.putProfile(formData, this.authorizationToken).subscribe((response) => {
          Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
          this.editProfileClicked = false;
          this.openProfile("Profile");
          this.router.navigate(['/profile/', value]);
        },
          (error) => {
            Swal.fire('Oops...', error.error.message, 'error');
            this.cancel(value);
          });
        //   this.apiService.putProfile(document.forms["RegForm"]["firstname"].value, document.forms["RegForm"]["lastname"].value, document.forms["RegForm"]["email"].value, document.forms["RegForm"]["dob"].value, document.forms["RegForm"]["mobile"].value, this.gender, this.authorizationToken).subscribe((response) => {
        //     Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
        //     this.editProfileClicked = false;
        //     this.openProfile("Profile");
        //     this.router.navigate(['/profile/', value]);
        //   },
        //     (error) => {
        //       Swal.fire('Oops...', error.error.message, 'error');
        //       this.cancel(value);
        //     });
        return true;
      }
    }
  }

  cancel(value) {
    let dialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '250px',
      data: {
        from: "Profile"
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(value1 => {
      if (value1) {
        this.editProfileClicked = false;
        this.router.navigate(['/profile/', value]);
      }
      else if (!value1) {
        //Swal.fire("Continue Editing...");
        this.toastr.success("Continue Editing...");
      }
    });
  }

  openAddress(Address) {
    this.selectedButton = "Address";
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.getCustAddress(this.authorizationToken).subscribe((data) => {
        this.addresses = JSON.parse(JSON.stringify(data)).customer_address;
        this.noAddressFound = false;
      },
        (error) => {
          this.noAddressFound = true;
        });
      this.router.navigate(['/profile/', Address]);
    }
  }

  gotoEditAddress(address_id: any) {
    this.router.navigate(['/profile/add-address/', address_id]);
  }

  gotoAddAddress() {
    this.router.navigate(['/profile/add-address/']);
  }

  deleteAddress(address_id: any) {
    let dialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '250px',
      data: {
        from: "AddressDelete"
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
          this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
          this.apiService.deleteDeladdress(address_id, this.authorizationToken).subscribe((response) => {
            //Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
            this.toastr.success(JSON.parse(JSON.stringify(response)).message, "Deleted !");
            this.openAddress("Address");
          },
            (error) => {

            });
        }
      }
    });
  }

  openPassword(Password) {
    this.selectedButton = "Password";
    this.router.navigate(['/profile/', Password]);
  }

  formValidation() {

    var password1 = document.forms["RegForm"]["password1"]; //User Old Password.
    var password2 = document.forms["RegForm"]["password2"]; //User New Password.
    var password3 = document.forms["RegForm"]["password3"]; //User Confirm Password.

    //REGEX FOR VALIDATIONS.
    var passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (password1.value == "") {
      document.getElementById("password2_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "";
      document.getElementById("password1_error").innerHTML = "* Please enter your old password.";
      password1.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(password1.value)))) {
      document.getElementById("password2_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "";
      document.getElementById("password1_error").innerHTML = "* Enter the password as per NOTE given above.";
      password1.focus();
      return false;
    }

    if (password2.value == "") {
      document.getElementById("password1_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "";
      document.getElementById("password2_error").innerHTML = "* Please enter your new password.";
      password2.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(password2.value)))) {
      document.getElementById("password1_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "";
      document.getElementById("password2_error").innerHTML = "* Enter the password as per NOTE given above.";
      password2.focus();
      return false;
    }

    if (password3.value == "") {
      document.getElementById("password1_error").innerHTML = "";
      document.getElementById("password2_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "* Please enter your confirm password.";
      password3.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(password3.value)))) {
      document.getElementById("password1_error").innerHTML = "";
      document.getElementById("password2_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "* Enter the password as per NOTE given above.";
      password3.focus();
      return false;
    }

    if (password2.value != password3.value) {
      document.getElementById("password1_error").innerHTML = "";
      document.getElementById("password2_error").innerHTML = "";
      document.getElementById("password3_error").innerHTML = "* New Password and Confirm Password didn't matched.";
      password3.focus();
      return false;
    }

    else {
      if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
        this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
        this.apiService.postChangePassword(password1.value, password2.value, password3.value, this.authorizationToken).subscribe((response) => {
          Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success").then(() => {
            this.logout();
          });
        },
          (error) => {
            Swal.fire('Oops...', error.error.message, 'error');
            password1.value = "";
            password2.value = "";
            password3.value = "";
          });
        return true;
      }
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
          from: "ChangePassword"
        },
        disableClose: true
      });
    }
  }

  togglePasswordType1() {
    if (this.passwordType1 == "text") {
      this.passwordType1 = "password";
    }
    else if (this.passwordType1 == "password") {
      this.passwordType1 = "text";
    }
  }

  togglePasswordType2() {
    if (this.passwordType2 == "text") {
      this.passwordType2 = "password";
    }
    else if (this.passwordType2 == "password") {
      this.passwordType2 = "text";
    }
  }

  togglePasswordType3() {
    if (this.passwordType3 == "text") {
      this.passwordType3 = "password";
    }
    else if (this.passwordType3 == "password") {
      this.passwordType3 = "text";
    }
  }

}