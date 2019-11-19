import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BehaviourService } from '../../Services/behaviour.service';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

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
    private auth: AuthService,
    private matDialog: MatDialog
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

  goToCart() {
    if (!this.auth.isLoggedIn()) {
      Swal.fire("Please Login First!");
      this.auth.logout();
    }
    else {
      this.router.navigate(["cart"]);
    }
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
    if (!localStorage.getItem('loggedIn')) {
      Swal.fire("Please Login First.");
    }
    else {
      let dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '250px',
        data: {
          from: "Logout"
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(value => {
        this.showProfileOption = value;
      });
    }
  }

}