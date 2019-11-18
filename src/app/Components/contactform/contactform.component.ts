import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.scss']
})
export class ContactformComponent implements OnInit {

  customer_id;

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.auth.logout();
      Swal.fire("Please Login First!");
    }
  }

  formValidation() {

    var fullname = document.forms["RegForm"]["fullname"]; //User Full Name Field;
    var email = document.forms["RegForm"]["email"]; //User Email Field;
    var mobile = document.forms["RegForm"]["mobile"]; //User Mobile Number Field.
    var subject = document.forms["RegForm"]["subject"]; //Subject Field.
    var message = document.forms["RegForm"]["message"]; //Message Field.

    //REGEX FOR VALIDATIONS.
    var nameValidationRegex = /^[A-Za-z]+$/;
    var emailValidationRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var mobileValidationRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

    if (fullname.value == "") {
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("fullname_error").innerHTML = "* Please enter your full name.";
      fullname.focus();
      return false;
    }

    if (!(nameValidationRegex.test(String(fullname.value).replace(/\s/g, "")))) {
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("fullname_error").innerHTML = "* Enter correct full name.";
      fullname.focus();
      return false;
    }

    if (email.value == "") {
      document.getElementById("fullname_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Please enter your email.";
      email.focus();
      return false;
    }

    if (!(emailValidationRegex.test(String(email.value).toLowerCase()))) {
      document.getElementById("fullname_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "* Enter correct email.";
      email.focus();
      return false;
    }

    if (mobile.value == "") {
      document.getElementById("fullname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "* Please enter your mobile number.";
      mobile.focus();
      return false;
    }

    if (!(mobileValidationRegex.test(String(mobile.value)))) {
      document.getElementById("fullname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "* Enter correct mobile number.";
      mobile.focus();
      return false;
    }

    if (subject.value == "") {
      document.getElementById("fullname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "* Please enter subject.";
      subject.focus();
      return false;
    }

    if (message.value == "") {
      document.getElementById("fullname_error").innerHTML = "";
      document.getElementById("email_error").innerHTML = "";
      document.getElementById("mobile_error").innerHTML = "";
      document.getElementById("subject_error").innerHTML = "";
      document.getElementById("message_error").innerHTML = "* Please enter message.";
      message.focus();
      return false;
    }

    else {
      if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
        this.customer_id = JSON.parse(localStorage.getItem('userDetails')).customer_details.customer_id;
        this.apiService.postContactUs(this.customer_id, fullname.value, email.value, mobile.value, subject.value, message.value).subscribe((response) => {
          Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
          this.router.navigate(['/']);
        },
          (error) => {
            Swal.fire('Oops...', error.error.message, 'error');
          });
        return true;
      }
      else {
        Swal.fire('Oops...', "Kindly Login for Contacting", 'error');
        this.router.navigate(['login']);
      }
    }

  }

}