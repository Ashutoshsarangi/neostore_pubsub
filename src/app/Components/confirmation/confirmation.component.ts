import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BehaviourService } from '../../Services/behaviour.service';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  from;
  product_name;
  dialogHeading;
  authorizationToken;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private behaviourService: BehaviourService,
    private apiService: ApiService,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {
    this.from = JSON.parse(JSON.stringify(this.data)).from;
    this.product_name = JSON.parse(JSON.stringify(this.data)).product_name;
    if (this.from == "Logout") {
      this.dialogHeading = "Do you want to logout?";
    }
    else if (this.from == "ChangePassword") {
      this.dialogHeading = "You password has been changed and you are about to logout...";
    }
    else if (this.from == "Cart") {
      this.dialogHeading = "Do you want to delete " + this.product_name + "?";
    }
    else if (this.from == "Address" || this.from == "Profile") {
      this.dialogHeading = "Do you want to cancel the form?";
    }
  }

  yes() {
    if (this.from == "Logout") {
      this.logout(); //Logout.
    }
    else if (this.from == "Cart") {
      this.dialogRef.close(true); //Delete Product Functionality.
    }
    else if (this.from == "Address" || this.from == "Profile") {
      this.dialogRef.close(true); //Cancel the form.
    }
  }

  no() {
    if (this.from == "Logout") {
      this.dialogRef.close(true); //Do not logout - showProfileOption true;
    }
    else if (this.from == "Cart") {
      this.dialogRef.close(false); //Do Not Delete The Product.
    }
    else if (this.from == "Address" || this.from == "Profile") {
      this.dialogRef.close(false); //Do Not Cancel The Form.
    }
  }

  logout() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      if (localStorage.getItem('cartProduct')) {
        this.postCartDataWhileLogout();
      }
      else {
        this.logoutWithNoCartData();
      }
    }
  }

  postCartDataWhileLogout() {
    var a = [];
    a = JSON.parse(localStorage.getItem('cartProduct'));
    a.splice(a.length - 1, 1);
    var obj = {
      flag: "logout"
    };
    a.push(obj);
    localStorage.setItem('cartProduct', JSON.stringify(a));
    this.postCartDataWhileLogoutApi(a, this.authorizationToken);
  }

  postCartDataWhileLogoutApi(a, authorizationToken) {
    this.apiService.postAddProductToCartCheckout(a, authorizationToken).subscribe((response) => {
      this.logoutWithNoCartData();
      Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

  logoutWithNoCartData() {
    Swal.fire("Great !", "You have successfully logged out!", "success");
    localStorage.removeItem('registered');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('cartProduct');
    localStorage.removeItem('cartCount');
    this.behaviourService.clearCount();
    this.behaviourService.clearLogin();
    this.dialogRef.close(false); //Logout - showProfileOption false;
    this.auth.logout();
  }

}