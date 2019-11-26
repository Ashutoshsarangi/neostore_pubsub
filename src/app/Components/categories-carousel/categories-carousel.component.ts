import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BehaviourService } from '../../Services/behaviour.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories-carousel',
  templateUrl: './categories-carousel.component.html',
  styleUrls: ['./categories-carousel.component.scss']
})
export class CategoriesCarouselComponent implements OnInit {

  imageUrl;

  categoriesResponseObjectStringified;
  categoriesResponseObjectParsed;
  categoriesDetailsArray;

  topRatingProductResponseObjectStringified;
  topRatingProductResponseObjectParsed;
  productDetailsArray;

  authorizationToken;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private behaviourService: BehaviourService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.imageUrl = environment.apiUrl;

    this.apiService.getAllCategories().subscribe((data) => {
      this.categoriesResponseObjectStringified = (JSON.stringify(data));
      this.categoriesResponseObjectParsed = JSON.parse(this.categoriesResponseObjectStringified);
      this.categoriesDetailsArray = this.categoriesResponseObjectParsed.category_details;
    });

    this.apiService.defaultTopRatingProduct().subscribe((data) => {
      this.topRatingProductResponseObjectStringified = (JSON.stringify(data));
      this.topRatingProductResponseObjectParsed = JSON.parse(this.topRatingProductResponseObjectStringified);
      this.productDetailsArray = this.topRatingProductResponseObjectParsed.product_details;
      for (let i = 0; i <= this.productDetailsArray.length; i++) {
        if (this.productDetailsArray[i].DashboardProducts[0].product_rating == "NaN" || this.productDetailsArray[i].DashboardProducts[0].product_rating == "" || this.productDetailsArray[i].DashboardProducts[0].product_rating == null || this.productDetailsArray[i].DashboardProducts[0].product_rating == undefined) {
          var productDetailsArrayTemp = this.productDetailsArray.splice(i, 1);
        }
      }
      this.productDetailsArray = productDetailsArrayTemp;
    });

  }

  /**
 * Go To All Products Section When Clicked on Carousel.
 * @param {string} category_id - Category Id.
 * @param {string} category_name - Category Name.
 */
  gotoAllProducts(category_id: any, category_name: any) {
    this.router.navigate(['/allproducts/', category_id, category_name]);
  }

  /**
 * Go To Product Details Section When Clicked on Cards.
 * @param {string} productId - Product Id.
 */
  gotoProductDetails(productId: any) {
    this.router.navigate(['/productdetails/', productId]);
  }

  /**
* Add To Cart.
* @param {Object} productToAdd - Product to add.
*/
  addToCart(productToAdd) {

    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      if (localStorage.getItem('cartCount') && localStorage.getItem('cartProduct')) {
        var cartCount = JSON.parse(localStorage.getItem('cartCount'));
        var a = [];
        a = JSON.parse(localStorage.getItem('cartProduct'));
        if (a.some(product => product._id === productToAdd.product_id)) {
          Swal.fire("Product Already in Cart");
        }
        else {
          localStorage.setItem('cartCount', cartCount + 1);
          this.behaviourService.setCount(JSON.stringify(cartCount + 1));
          let productToAddObject = {
            product_id: productToAdd.product_id,
            _id: productToAdd._id,
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
          product_id: productToAdd.product_id,
          _id: productToAdd._id,
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

  /**
* Add To Cart API.
* @param {Object} result - Product to add.
* @param {string} authorizationToken - Authorization Token.
*/
  addToCartApi(result, authorizationToken) {
    this.apiService.postAddProductToCartCheckout(result, authorizationToken).subscribe((response) => {
      this.toastr.success('Added Successfully', 'Great !');
    },
      (error) => {
        Swal.fire('Oops...', error.error.message, 'error');
      });
  }

}