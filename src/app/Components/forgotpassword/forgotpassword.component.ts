import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  authorizationToken;
  verifyCodeForm: boolean = false;
  verifiedToken;

  passwordType1 = "password";
  passwordType2 = "password";

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() { }

  /** @function
 * @name formValidation - Validating Email and Hitting Forget Password Api.
 */
  formValidation() {

    var email = document.forms["RegForm"]["email"]; //User Email Field;

    //REGEX FOR VALIDATIONS.
    //var emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var emailValidationRegex = /^[A-Za-z]{2,}[A-Za-z0-9]{0,}[.]{0,1}[A-Za-z0-9]{1,}[.]{0,1}[A-Za-z0-9]{1,}@[A-Za-z]{2,}[.]{1}[A-za-z]{2,3}[.]{0,1}[a-z]{0,2}$/;

    if (email.value == "") {
      document.getElementById("email_error").innerHTML = "* Please enter your email.";
      email.focus();
      return false;
    }

    if (!(emailValidationRegex.test(String(email.value).toLowerCase()))) {
      document.getElementById("email_error").innerHTML = "* Enter correct email.";
      email.focus();
      return false;
    }

    else {
      this.apiService.postForgotPassword(email.value).subscribe((response) => {
        Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
        this.verifyCodeForm = true;
        this.verifiedToken = "Bearer " + JSON.parse(JSON.stringify(response)).token;
      }, (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
      return true;
    }

  }

  /** @function
* @name formValidation1 - Validating Password Fields and Hitting Recover Password Api.
*/
  formValidation1() {

    var code = document.forms["RegForm"]["code"]; //User Verfication Code.
    var newpassword = document.forms["RegForm"]["newpassword"]; //User New Password.
    var confirmpassword = document.forms["RegForm"]["confirmpassword"]; //User Confirm Password.

    //REGEX FOR VALIDATIONS.
    var codeValidationRegex = /^\d{4}$/;
    var passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (code.value == "") {
      document.getElementById("newpassword_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("code_error").innerHTML = "* Please enter Verification code that has been sent to your registered mail ID.";
      code.focus();
      return false;
    }

    if (!(codeValidationRegex.test(String(code.value)))) {
      document.getElementById("newpassword_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("code_error").innerHTML = "* Enter correct verification code.";
      code.focus();
      return false;
    }

    if (newpassword.value == "") {
      document.getElementById("code_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("newpassword_error").innerHTML = "* Please enter your new password.";
      newpassword.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(newpassword.value)))) {
      document.getElementById("code_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "";
      document.getElementById("newpassword_error").innerHTML = "* The password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, 8-12 characters long.";
      newpassword.focus();
      return false;
    }

    if (confirmpassword.value == "") {
      document.getElementById("code_error").innerHTML = "";
      document.getElementById("newpassword_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "* Please enter your confirm password.";
      confirmpassword.focus();
      return false;
    }

    if (!(passwordValidationRegex.test(String(confirmpassword.value)))) {
      document.getElementById("code_error").innerHTML = "";
      document.getElementById("newpassword_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "* The password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character, 8-12 characters long.";
      confirmpassword.focus();
      return false;
    }

    if (newpassword.value != confirmpassword.value) {
      document.getElementById("code_error").innerHTML = "";
      document.getElementById("newpassword_error").innerHTML = "";
      document.getElementById("confirmpassword_error").innerHTML = "* New Password and Confirm Password didn't matched.";
      confirmpassword.focus();
      return false;
    }

    else {
      this.apiService.postRecoverPassword(code.value, newpassword.value, confirmpassword.value, this.verifiedToken).subscribe((response) => {
        Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
        this.verifyCodeForm = false;
        this.router.navigate(['/login']);
      }, (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
      return true;
    }

  }

  /** @function
* @name togglePasswordType1 - Show and Hide Functionality for Password.
*/
  togglePasswordType1() {
    if (this.passwordType1 == "text") {
      this.passwordType1 = "password";
    }
    else if (this.passwordType1 == "password") {
      this.passwordType1 = "text";
    }
  }

  /** @function
* @name togglePasswordType2 - Show and Hide Functionality for Confirm Password.
*/
  togglePasswordType2() {
    if (this.passwordType2 == "text") {
      this.passwordType2 = "password";
    }
    else if (this.passwordType2 == "password") {
      this.passwordType2 = "text";
    }
  }

}