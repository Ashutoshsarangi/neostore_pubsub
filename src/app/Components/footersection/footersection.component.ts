import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-footersection',
  templateUrl: './footersection.component.html',
  styleUrls: ['./footersection.component.scss']
})
export class FootersectionComponent implements OnInit {

  pdfUrl;

  companyDetailsResponseObjectStringified;
  companyDetailsResponseObjectParsed;
  companyDetailsArray;
  companyAbout;
  companyContact;
  companyEmail;
  companyAddress;

  termsAndConditionsResponseObjectStringified;
  termsAndConditionsResponseObjectParsed;
  termsAndConditionsArray;
  termsAndConditions;
  fileName;

  guaranteeResponseObjectStringified;
  guaranteeResponseObjectParsed;
  guaranteeArray;
  guarantee;
  fileName1;

  email;

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {

    this.pdfUrl = environment.apiUrl;

    this.email = " ";

    this.apiService.getAboutCompany().subscribe((data) => {
      this.companyDetailsResponseObjectStringified = (JSON.stringify(data));
      this.companyDetailsResponseObjectParsed = JSON.parse(this.companyDetailsResponseObjectStringified);
      this.companyDetailsArray = this.companyDetailsResponseObjectParsed.company_details;
      this.companyAbout = this.companyDetailsArray[0].about_company;
      this.companyContact = this.companyDetailsArray[0].email;
      this.companyEmail = this.companyDetailsArray[0].phone_no;
      this.companyAddress = this.companyDetailsArray[0].address;
    });

    this.apiService.getTermsAndConditions().subscribe((data) => {
      this.termsAndConditionsResponseObjectStringified = (JSON.stringify(data));
      this.termsAndConditionsResponseObjectParsed = JSON.parse(this.termsAndConditionsResponseObjectStringified);
      this.termsAndConditionsArray = this.termsAndConditionsResponseObjectParsed.termsAndConditions_details;
      this.termsAndConditions = this.termsAndConditionsArray[0];
      this.fileName = this.termsAndConditions.fileName;
    });

    this.apiService.getGuarantee().subscribe((data) => {
      this.guaranteeResponseObjectStringified = (JSON.stringify(data));
      this.guaranteeResponseObjectParsed = JSON.parse(this.guaranteeResponseObjectStringified);
      this.guaranteeArray = this.guaranteeResponseObjectParsed.guarantee_details;
      this.guarantee = this.guaranteeArray[0];
      this.fileName1 = this.guarantee.fileName;
    });

  }

  openPDF() {
    window.open(this.pdfUrl + this.fileName);
  }

  openPDF1() {
    window.open(this.pdfUrl + this.fileName1);
  }

  gotoThankYouSubscribe(email) {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.email = email;
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.email == "") {
        Swal.fire("Please enter your email.");
        return false;
      }
      if (!(re.test(String(this.email).toLowerCase()))) {
        Swal.fire("Enter correct email");
        return false;
      }
      else {
        this.router.navigate(['/thankyou-subscribing/', this.email]);
        return true;
      }
    }
    else {
      Swal.fire("Please Login First!");
      this.router.navigate(['login']);
    }
  }

}