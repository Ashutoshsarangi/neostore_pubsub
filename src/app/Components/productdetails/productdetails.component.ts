import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';
import { BehaviourService } from '../../Services/behaviour.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  product_id: any;
  product_rating: any;
}

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss']
})
export class ProductdetailsComponent implements OnInit {

  product_id: any;

  productDetailsResponseObjectStringified;
  productDetailsResponseObjectParsed;
  productDetailsDetailsArray;

  imageUrl;

  imageToShow;

  doneButtonColor = "#DEDEDE";
  doneButtonTextColor = "#A3A3A3";

  product_rating: any;

  myThumbnail;
  myFullresImage;

  authorizationToken;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private matDialog: MatDialog,
    private behaviourService: BehaviourService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.imageUrl = environment.apiUrl;
    this.activatedRoute.params.subscribe(routeParams => {
      this.product_id = routeParams.id;
    });
    this.apiService.getProductByProdId(this.product_id).subscribe((data) => {
      this.productDetailsResponseObjectStringified = (JSON.stringify(data));
      this.productDetailsResponseObjectParsed = JSON.parse(this.productDetailsResponseObjectStringified);
      this.productDetailsDetailsArray = this.productDetailsResponseObjectParsed.product_details[0];
      this.imageToShow = this.productDetailsDetailsArray.product_image;
      this.myFullresImage = this.imageUrl + this.imageToShow;
      this.myThumbnail = this.imageUrl + this.imageToShow;
    });
  }

  changeProductImage(image) {
    this.imageToShow = image;
    this.myFullresImage = this.imageUrl + this.imageToShow;
    this.myThumbnail = this.imageUrl + this.imageToShow;
  }

  rateProduct() {
    if (!localStorage.getItem('loggedIn')) {
      Swal.fire("Please Login First.");
    }
    else {
      let dialogRef = this.matDialog.open(RatingModalComponent, {
        width: '250px',
        data: {
          product_id: this.productDetailsDetailsArray.product_id,
          product_rating: this.productDetailsDetailsArray.product_rating
        }
      });
      dialogRef.afterClosed().subscribe(value => {

      });
    }
  }

  addToCart() {

    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      if (localStorage.getItem('cartCount') && localStorage.getItem('cartProduct')) {
        var cartCount = JSON.parse(localStorage.getItem('cartCount'));
        var a = [];
        a = JSON.parse(localStorage.getItem('cartProduct'));
        if (a.some(product => product._id === this.productDetailsResponseObjectParsed.product_details[0].product_id)) {
          Swal.fire('Oops...', "Product Already in Cart", 'error');
        }
        else {
          localStorage.setItem('cartCount', cartCount + 1);
          this.behaviourService.setCount(JSON.stringify(cartCount + 1));
          let productToAddObject = {
            product_id: this.productDetailsResponseObjectParsed.product_details[0].product_id,
            _id: this.productDetailsResponseObjectParsed.product_details[0]._id,
            quantity: 1
          }
          a.push(productToAddObject);
          localStorage.setItem('cartProduct', JSON.stringify(a));
          var obj = {
            flag: "logout"
          };
          a.push(obj);
          this.addToCartApi(a, this.authorizationToken);
        }
      }
      else {
        localStorage.setItem('cartCount', JSON.stringify(1));
        this.behaviourService.setCount("1");
        var a = [];
        let productToAddObject = {
          product_id: this.productDetailsResponseObjectParsed.product_details[0].product_id,
          _id: this.productDetailsResponseObjectParsed.product_details[0]._id,
          quantity: 1
        }
        a.push(productToAddObject);
        localStorage.setItem('cartProduct', JSON.stringify(a));
        var obj = {
          flag: "logout"
        };
        a.push(obj);
        this.addToCartApi(a, this.authorizationToken);
      }
    }
    else {
      Swal.fire("Please Login First.");
      this.router.navigate(['/login']);
    }

  }

  addToCartApi(result, authorizationToken) {
    this.apiService.postAddProductToCartCheckout(result, authorizationToken).subscribe((response) => {
      //Swal.fire("Great !", "Added Successfully", "success");
      this.toastr.success('Added Successfully', 'Great !');
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

}