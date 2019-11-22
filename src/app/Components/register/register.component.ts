import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  gender: string; //To store the selected gender;

  passwordType1 = "password";
  passwordType2 = "password";

  constructor(
    private apiService: ApiService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      Swal.fire("You are already login! Kindly logout for new registration");
      this.router.navigate(['categories-carousel']);
    }
    else {
      this.gender = "Male"; //Gender By Default Selected to MALE.
    }
  }

  formValidation() {

    var firstname = document.forms["RegForm"]["firstname"]; //User First Name Field;
    var lastname = document.forms["RegForm"]["lastname"]; //User Last Name Field;
    var email = document.forms["RegForm"]["email"]; //User Email Field;
    var password = document.forms["RegForm"]["password"]; // User Password Field.
    var confirmpassword = document.forms["RegForm"]["confirmpassword"]; //User Confirm Password Field.
    var mobile = document.forms["RegForm"]["mobile"]; //User Mobile Number Field.

    //REGEX FOR VALIDATIONS.
    var nameValidationRegex = /^[A-Za-z]+$/;
    //var emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var emailValidationRegex = /^[A-Za-z]{2,}[A-Za-z0-9]{0,}[.]{0,1}[A-Za-z0-9]{1,}[.]{0,1}[A-Za-z0-9]{1,}@[A-Za-z]{2,}[.]{1}[A-za-z]{2,3}[.]{0,1}[a-z]{0,2}$/;
    var passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    var mobileValidationRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

    if (firstname.value == "") {
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("firstname_error").innerHTML = "* Please enter your first name.";
      firstname.focus();
      return false;
    }

    if (!(nameValidationRegex.test(String(firstname.value)))) {
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("firstname_error").innerHTML = "* Enter correct first name.";
      firstname.focus();
      return false;
    }

    if (lastname.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "* Please enter your last name.";
      lastname.focus();
      return false;
    }

    if (!(nameValidationRegex.test(String(lastname.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "* Enter correct last name.";
      lastname.focus();
      return false;
    }

    if (email.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Please enter your email.";
      email.focus();
      return false;
    }

    if (!(emailValidationRegex.test(String(email.value).toLowerCase()))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Enter correct email.";
      email.focus();
      return false;
    }

    if (password.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "* Please enter your password.";
      password.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(password.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "* The password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, 8-12 characters long.";
      password.focus();
      return false;
    }

    if (confirmpassword.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "* Please enter your confirm password.";
      confirmpassword.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(confirmpassword.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "* The password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, 8-12 characters long.";
      confirmpassword.focus();
      return false;
    }

    if (password.value != confirmpassword.value) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "* Password and Confirm Password didn't matched.";
      confirmpassword.focus();
      return false;
    }

    if (mobile.value == "") {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "* Please enter your mobile number.";
      mobile.focus();
      return false;
    }

    if (!(mobileValidationRegex.test(String(mobile.value)))) {
      document.getElementById("firstname_error").innerHTML = "";
      document.getElementById("lastname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("password_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "* Enter correct mobile number.";
      mobile.focus();
      return false;
    }

    if (this.gender == "" || this.gender == null || this.gender == undefined) {
      Swal.fire("Please select a Gender.");
      return false;
    }

    else {
      this.apiService.postRegister(firstname.value, lastname.value, email.value, password.value, confirmpassword.value, mobile.value, this.gender).subscribe((response) => {
        Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
        localStorage.setItem('registered', "true");
        this.router.navigate(['login']);
      },
        (error) => {
          Swal.fire('Oops...', error.error.message, 'error');
        });
      return true;
    }

  }

  gotologin() {
    this.router.navigate(["login"]);
  }

  // openFacebook() {
  //   window.open('https://www.facebook.com/');
  // }

  // openGoogle() {
  //   window.open('https://www.google.com/intl/en-GB/gmail/about/#');
  // }

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

}