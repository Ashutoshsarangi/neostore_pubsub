import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BehaviourService } from '../../Services/behaviour.service';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.from = JSON.parse(JSON.stringify(this.data)).from;
    this.product_name = JSON.parse(JSON.stringify(this.data)).product_name;
    if (this.from == "Logout") {
      this.dialogHeading = "Do you want to logout?";
    }
    else if (this.from == "ChangePassword") {
      this.logout();
    }
    else if (this.from == "Cart") {
      this.dialogHeading = "Do you want to delete " + this.product_name + "?";
    }
    else if (this.from == "Address" || this.from == "Profile") {
      this.dialogHeading = "Do you want to cancel the form?";
    }
    else if (this.from == "AddressDelete") {
      this.dialogHeading = "Do you want to delete this Address ?";
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
    else if (this.from == "AddressDelete") {
      this.dialogRef.close(true); //Delete Address Functionality.
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
    else if (this.from == "AddressDelete") {
      this.dialogRef.close(false); //Do Not Delete The Address.
    }
  }

  logout() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      if (localStorage.getItem('cartProduct')) {
        this.postCartDataWhileLogout('HasCartData');
      }
      else {
        this.logoutWithNoCartData('NoCartData');
      }
    }
  }

  postCartDataWhileLogout(value) {
    var a = [];
    a = JSON.parse(localStorage.getItem('cartProduct'));
    a.splice(a.length - 1, 1);
    var obj = {
      flag: "logout"
    };
    a.push(obj);
    localStorage.setItem('cartProduct', JSON.stringify(a));
    this.postCartDataWhileLogoutApi(a, this.authorizationToken, value);
  }

  postCartDataWhileLogoutApi(a, authorizationToken, value) {
    this.apiService.postAddProductToCartCheckout(a, authorizationToken).subscribe((response) => {
      this.logoutWithNoCartData(value);
      if (this.from == "ChangePassword") {
        Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message + " Kindly relogin with your new password!!", "success");
      }
      else {
        //Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
        this.toastr.success(JSON.parse(JSON.stringify(response)).message, 'Great !');
      }
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

  logoutWithNoCartData(value) {
    if (this.from == "ChangePassword" && value == "NoCartData") {
      Swal.fire("Great !", "You have been logged out!! Kindly relogin with your new password!!");
    }
    else if (this.from != "ChangePassword" && value == "NoCartData") {
      //Swal.fire("Great !", "You have successfully logged out!", "success");
      this.toastr.success("You have successfully logged out!", 'Great !');
    }
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