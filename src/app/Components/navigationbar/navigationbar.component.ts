import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BehaviourService } from '../../Services/behaviour.service';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {

  showProfileOption: boolean = false;
  subscription: Subscription;
  cartCount: string;
  authorizationToken;

  cartDataResponseObjectStringified;
  cartDataResponseObjectParsed;
  cartData;

  constructor(
    private router: Router,
    private behaviourService: BehaviourService,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    this.subscription = this.behaviourService.getCount().subscribe(count => {
      if (count) {
        this.cartCount = count.value;
      } else {
        this.cartCount = null;
      }
    });
    this.subscription = this.behaviourService.getLogin().subscribe(login => {
      if (login) {
        if (login.value == "true") {
          this.showProfileOption = true;
        }
      } else {
        this.showProfileOption = false;
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem('loggedIn')) {
      this.showProfileOption = true;
    } else {
      this.showProfileOption = false;
    }
    this.cartCount = JSON.parse(localStorage.getItem('cartCount'));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  gotoProfile(value) {
    if (localStorage.getItem('loggedIn')) {
      this.router.navigateByUrl('/profile', { skipLocationChange: true });
      setTimeout(() => this.router.navigate(['/profile/', value]));
    }
    else {
      Swal.fire("Please Login First");
      this.router.navigate(['/login']);
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
    this.logoutWithNoCartData();
    this.apiService.postAddProductToCartCheckout(a, authorizationToken).subscribe((response) => {
      Swal.fire("Great !", JSON.parse(JSON.stringify(response)).message, "success");
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

  logoutWithNoCartData() {
    localStorage.removeItem('registered');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('cartProduct');
    localStorage.removeItem('cartCount');
    this.behaviourService.clearCount();
    this.behaviourService.clearLogin();
    this.showProfileOption = false;
    this.auth.logout();
  }

}