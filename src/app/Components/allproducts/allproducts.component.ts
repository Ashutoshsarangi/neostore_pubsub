import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BehaviourService } from '../../Services/behaviour.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.scss']
})
export class AllproductsComponent implements OnInit {

  imageUrl; //Base API Url.

  selectedCategoryIdFromCarousel: any; //Category Id from Carousel on Dashboard.
  selectedCategoryNameFromCarousel: any; //Category Name from Carousel on Dashboard.

  selectedProductIdFromSearchList: any; //Product Id from Search List opened from Navigation Bar.
  selectedCategoryIdFromSearchList: any; //Category Id from Search List opened from Navigation Bar.
  selectedCategoryNameFromSearchList: any; //Category Name from Search List opened from Navigation Bar.
  selectedColorIdFromSearchList: any; //Color Id from Search List opened from Navigation Bar.
  selectedColorCodeFromSearchList: any; //Color Code from Search List opened from Navigation Bar.

  selectedCategoryName; //Binding Selected Category Name with the UI.
  selectedColorCode; //Binding Selected Color Code with the UI.

  allProductsResponseObjectStringified; //All Products Response Object in Stringified Format.
  allProductsResponseObjectParsed; //All Products Response Object after Parsing.
  allProductsDetailsArray; //All Products Array.

  categoriesResponseObjectStringified; //All Categories Response Object in Stringified Format.
  categoriesResponseObjectParsed; //All Categories Response Object after Parsing.
  categoriesDetailsArray; //All Categories Array.

  allColorsResponseObjectStringified; //All Colors Response Object in Stringified Format.
  allColorsResponseObjectParsed; //All Colors Response Object after Parsing.
  allColorsDetailsArray; //All Colors Array.

  categoriesClicked: boolean = false; //Set to true once clicked on Category List.
  colorsClicked: boolean = false; //Set to true once clicked on Color List.

  notFoundProduct: boolean = false; //Set to true when No Product is found.

  pageOfItems: Array<any>; //Updated Array to be displayed in pagination.

  authorizationToken;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private behaviourService: BehaviourService,
    private toastr: ToastrService
  ) {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    this.imageUrl = environment.apiUrl; //Getting the base API Url from environment.ts file.

    this.getAllProducts(); //Fetching all products.
    this.getAllCategories(); //Fetching all categories.
    this.getAllColors(); //Fetching all colors.

    //Getting Selected Category Id from Carousel on Dashboard.
    this.selectedCategoryIdFromCarousel = this.activatedRoute.snapshot.paramMap.get('category_id');
    //Getting Selected Category Name from Carousel on Dashboard.
    this.selectedCategoryNameFromCarousel = this.activatedRoute.snapshot.paramMap.get('category_name');

    //Getting Selected Product Id from Search List opened from Navigation Bar.
    this.selectedProductIdFromSearchList = this.activatedRoute.snapshot.paramMap.get('_id');
    //Getting Selected Category Id from Search List opened from Navigation Bar.
    this.selectedCategoryIdFromSearchList = this.activatedRoute.snapshot.paramMap.get('category_id');
    //Getting Selected Category Name from Search List opened from Navigation Bar.
    this.selectedCategoryNameFromSearchList = this.activatedRoute.snapshot.paramMap.get('category_name');
    //Getting Selected Color Id from Search List opened from Navigation Bar.
    this.selectedColorIdFromSearchList = this.activatedRoute.snapshot.paramMap.get('color_id');
    //Getting Selected Color Code from Search List opened from Navigation Bar.
    this.selectedColorCodeFromSearchList = this.activatedRoute.snapshot.paramMap.get('color_code');

    // this.activatedRoute.params.subscribe(routeParams => {
    //   this.selectedProductIdFromSearchList = routeParams._id;
    // });

    // this.activatedRoute.params.subscribe(routeParams => {
    //   this.selectedCategoryIdFromSearchList = routeParams.category_id;
    // });

    // this.activatedRoute.params.subscribe(routeParams => {
    //   this.selectedCategoryNameFromSearchList = routeParams.category_name;
    // });

    // this.activatedRoute.params.subscribe(routeParams => {
    //   this.selectedColorIdFromSearchList = routeParams.color_id;
    // });

    // this.activatedRoute.params.subscribe(routeParams => {
    //   this.selectedColorCodeFromSearchList = routeParams.color_code;
    // });

    //When clicked on Products Option given in Navigation Bar.
    if (this.router.url === '/allproducts') {
      this.selectedCategoryName = "All Categories";
    }
    //When clicked on Carousel given on Dashboard.
    else if (this.router.url === '/allproducts/' + this.selectedCategoryIdFromCarousel + '/' + this.selectedCategoryNameFromCarousel) {
      localStorage.setItem('category_id', this.selectedCategoryIdFromCarousel);
      this.selectedCategoryName = this.selectedCategoryNameFromCarousel;
      this.getProductAccordingToFilters();
    }
    //When clicked on Search List opened from Navigation Bar.
    else if (this.router.url === '/allproducts/' + this.selectedProductIdFromSearchList + '/' + this.selectedCategoryIdFromSearchList + '/' + this.selectedCategoryNameFromSearchList + '/' + this.selectedColorIdFromSearchList) {
      localStorage.setItem('category_id', this.selectedCategoryIdFromSearchList);
      this.selectedCategoryName = this.selectedCategoryNameFromSearchList;
      localStorage.setItem('color_id', this.selectedColorIdFromSearchList);
      this.selectedColorCode = this.selectedColorCodeFromSearchList;
      this.getProductAccordingToFilters();
    }
    //When clicked on View All option on Dashboard.
    else if (this.router.url === '/categories-carousel/allproducts') {
      this.selectedCategoryName = "All Categories";
    }

  }

  //Toggling the Category List and Color List.
  openCategoriesList() {
    if (this.categoriesClicked == false) {
      this.categoriesClicked = true; //Open Category List.
      this.colorsClicked = false; //Close Color List.
    }
    else if (this.categoriesClicked == true) {
      this.categoriesClicked = false; //If Category List is open and clicked, then close it.
    }
  }

  //Toggling the Category List and Color List.
  openColorsList() {
    if (this.colorsClicked == false) {
      this.colorsClicked = true; //Open Color List.
      this.categoriesClicked = false; //Close Category List.
    }
    else if (this.colorsClicked == true) {
      this.colorsClicked = false; //If Color List is open and clicked, then close it.
    }
  }

  //Getting all products.
  getAllProducts() {
    this.selectedCategoryName = "All Categories"; //Set the heading to "All Categories".
    this.categoriesClicked = false; //Close Category List.
    this.colorsClicked = false; //Close Color List.
    localStorage.removeItem('category_id'); //Remove the Category Filter.
    localStorage.removeItem('color_id'); //Remove the Color Filter.
    localStorage.removeItem('sortBy'); //Remove the Product Rating and Ascending Filter.
    localStorage.removeItem('sortIn'); //Remove the Product Cost and Ascending/Descending Filter.
    this.apiService.getAllProducts().subscribe((data) => {
      this.allProductsResponseObjectStringified = (JSON.stringify(data));
      this.allProductsResponseObjectParsed = JSON.parse(this.allProductsResponseObjectStringified);
      if (this.allProductsResponseObjectParsed.success == true) {
        this.notFoundProduct = false; //Products Found.
        this.allProductsDetailsArray = this.allProductsResponseObjectParsed.product_details;
      }
      else if (this.allProductsResponseObjectParsed.success == false) {
        this.notFoundProduct = true; //No Products Found.
      }
    });
  }

  //Getting all categories.
  getAllCategories() {
    this.apiService.getAllCategories().subscribe((data) => {
      this.categoriesResponseObjectStringified = (JSON.stringify(data));
      this.categoriesResponseObjectParsed = JSON.parse(this.categoriesResponseObjectStringified);
      this.categoriesDetailsArray = this.categoriesResponseObjectParsed.category_details;
    });
  }

  //Getting all colors.
  getAllColors() {
    this.apiService.getAllColors().subscribe((data) => {
      this.allColorsResponseObjectStringified = (JSON.stringify(data));
      this.allColorsResponseObjectParsed = JSON.parse(this.allColorsResponseObjectStringified);
      this.allColorsDetailsArray = this.allColorsResponseObjectParsed.color_details;
    });
  }

  //Setting the Category Filter and Fetching the Products Accordingly.
  setCategoryId(value1, value2) {
    this.router.navigate(['/allproducts/', value1, value2]);
    localStorage.setItem('category_id', value1);
    this.selectedCategoryName = value2
    this.getProductAccordingToFilters();
  }

  //Setting the Color Filter and Fetching the Products Accordingly.
  setColorId(value1, value2) {
    localStorage.setItem('color_id', value1);
    this.selectedColorCode = value2;
    this.getProductAccordingToFilters();
  }

  //Setting the Product Rating & Ascending Filter and Fetching the Products Accordingly.
  setProductRating(value1, value2) {
    localStorage.setItem('sortBy', value1);
    localStorage.setItem('sortIn', value2);
    this.getProductAccordingToFilters();
  }

  //Setting the Product Cost & Ascending/Descending Filter and Fetching the Products Accordingly.
  setAscendingDescending(value1, value2) {
    localStorage.setItem('sortBy', value1);
    localStorage.setItem('sortIn', value2);
    this.getProductAccordingToFilters();
  }

  //Getting the Products According to applied filters.
  getProductAccordingToFilters() {
    this.apiService.getProductAccordingToFilters().subscribe((data) => {
      this.allProductsResponseObjectStringified = (JSON.stringify(data));
      this.allProductsResponseObjectParsed = JSON.parse(this.allProductsResponseObjectStringified);
      if (this.allProductsResponseObjectParsed.success == true) {
        this.notFoundProduct = false; //Products Found.
        this.allProductsDetailsArray = this.allProductsResponseObjectParsed.product_details;
        if (this.router.url === '/allproducts/' + this.selectedProductIdFromSearchList + '/' + this.selectedCategoryIdFromSearchList + '/' + this.selectedCategoryNameFromSearchList + '/' + this.selectedColorIdFromSearchList) {
          var allProductsDetailsArrayTemp = this.allProductsDetailsArray.filter(product =>
            product._id == this.selectedProductIdFromSearchList
          );
          this.allProductsDetailsArray = allProductsDetailsArrayTemp;
        }
      }
      else if (this.allProductsResponseObjectParsed.success == false) {
        this.notFoundProduct = true; //No Products Found.
      }
    });
  }

  //Updating the Array to be Displayed on Pagination.
  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  //Going to Product Details Page along with the Product Id.
  gotoProductDetails(productId: any) {
    this.router.navigate(['/productdetails/', productId]);
  }

  //Method to add the product in cart.
  addToCart(productToAdd) {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      if (localStorage.getItem('cartCount') && localStorage.getItem('cartProduct')) {
        var cartCount = JSON.parse(localStorage.getItem('cartCount'));
        var a = [];
        a = JSON.parse(localStorage.getItem('cartProduct'));
        if (a.some(product => product.product_id === productToAdd.product_id)) {
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