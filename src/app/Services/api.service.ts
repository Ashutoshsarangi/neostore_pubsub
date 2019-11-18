import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "http://180.149.241.208:3022/"; //Base API Url.

  authorizationToken; //Authorization Token from API.
  httpOptions; //Http Params Including Headers.

  constructor(
    private httpClient: HttpClient
  ) {

    if (localStorage.getItem('userDetails')) {

      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.authorizationToken
        })
      };

    }

  }

  //Getting the top rating products displayed on the Dashboard.
  public defaultTopRatingProduct() {
    return this.httpClient.get(this.baseUrl + `defaultTopRatingProduct`);
  }

  //Getting company details to be displayed in the Footer.
  public getAboutCompany() {
    return this.httpClient.get(this.baseUrl + `getData`);
  }

  //Getting terms and conditions pdf once clicked in the option given in the Footer.
  public getTermsAndConditions() {
    return this.httpClient.get(this.baseUrl + `getTermsAndConditions`);
  }

  //Getting guarantee pdf once clicked in the option given in the Footer.
  public getGuarantee() {
    return this.httpClient.get(this.baseUrl + `getGuarantee`);
  }

  //Getting all the products to be displayed in the Product List.
  public getAllProducts() {
    return this.httpClient.get(this.baseUrl + `getAllProducts`);
  }

  //Getting all the categories to be displayed in the Product List.
  public getAllCategories() {
    return this.httpClient.get(this.baseUrl + `getAllCategories`);
  }

  //Getting all the colors to be displayed in the Product List.
  public getAllColors() {
    return this.httpClient.get(this.baseUrl + `getAllColors`);
  }

  //Getting products based on the filters applied on the Product List.
  public getProductAccordingToFilters() {

    //Only Based on Category
    if (localStorage.getItem('category_id') && !localStorage.getItem('color_id') && !localStorage.getItem('sortBy') && !localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `category_id=` + localStorage.getItem('category_id'));
    }

    //Only Based on Color
    else if (!localStorage.getItem('category_id') && localStorage.getItem('color_id') && !localStorage.getItem('sortBy') && !localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `color_id=` + localStorage.getItem('color_id'));
    }

    //Only Based on (Product Rating and Ascending) OR (Product Cost and Ascending/Descending)
    else if (!localStorage.getItem('category_id') && !localStorage.getItem('color_id') && localStorage.getItem('sortBy') && localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `sortBy=` + localStorage.getItem('sortBy') + `&sortIn=` + localStorage.getItem('sortIn'));
    }

    //Based on Category and Color
    else if (localStorage.getItem('category_id') && localStorage.getItem('color_id') && !localStorage.getItem('sortBy') && !localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `category_id=` + localStorage.getItem('category_id') + `&color_id=` + localStorage.getItem('color_id'));
    }

    //Based on Category and (Product Rating and Ascending) OR (Product Cost and Ascending/Descending)
    else if (localStorage.getItem('category_id') && !localStorage.getItem('color_id') && localStorage.getItem('sortBy') && localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `category_id=` + localStorage.getItem('category_id') + `&sortBy=` + localStorage.getItem('sortBy') + `&sortIn=` + localStorage.getItem('sortIn'));
    }

    //Based on Color and (Product Rating and Ascending) OR (Product Cost and Ascending/Descending)
    else if (!localStorage.getItem('category_id') && localStorage.getItem('color_id') && localStorage.getItem('sortBy') && localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `color_id=` + localStorage.getItem('color_id') + `&sortBy=` + localStorage.getItem('sortBy') + `&sortIn=` + localStorage.getItem('sortIn'));
    }

    //Based on Category, Color and (Product Rating and Ascending) OR (Product Cost and Ascending/Descending)
    else if (localStorage.getItem('category_id') && localStorage.getItem('color_id') && localStorage.getItem('sortBy') && localStorage.getItem('sortIn')) {
      return this.httpClient.get(this.baseUrl + `commonProducts?` + `category_id=` + localStorage.getItem('category_id') + `&color_id=` + localStorage.getItem('color_id') + `&sortBy=` + localStorage.getItem('sortBy') + `&sortIn=` + localStorage.getItem('sortIn'));
    }

  }

  //Getting product details to be displayed in Product Details section.
  public getProductByProdId(product_id) {
    return this.httpClient.get(this.baseUrl + `getProductByProdId` + `/` + product_id);
  }

  //Getting customer address while checking out the products on Cart.
  public getCustAddress(authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.get(this.baseUrl + `getCustAddress`, this.httpOptions);
  }

  //Getting order details on Profile.
  public getOrderDetails(authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.get(this.baseUrl + `getOrderDetails`, this.httpOptions);
  }

  //Getting profile details on Profile.
  public getCustProfile(authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.get(this.baseUrl + `getCustProfile`, this.httpOptions);
  }

  //Getting customer cart details on Cart.
  public getCartData(authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.get(this.baseUrl + `getCartData`, this.httpOptions);
  }

  //Getting PDF of Order Details by Posting Order Object on Profile.
  public getInvoiceOfOrder(orderObject, authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.post(this.baseUrl + `getInvoiceOfOrder`, orderObject, this.httpOptions);
  }

  //Posting the details of Contact Us Form.
  public postContactUs(customer_id, fullname, email, mobile, subject, message) {
    let param = {
      customer_id: customer_id,
      email: email,
      name: fullname,
      subject: subject,
      phone_no: mobile,
      message: message
    }
    return this.httpClient.post(this.baseUrl + `contactUs`, param).map(data => data);
  }

  //Posting the details of Login Form.
  public postLogin(email, password) {
    let param = {
      email: email,
      pass: password
    }
    return this.httpClient.post(this.baseUrl + `login`, param).map(data => data);
  }

  //Posting the details of Registeration Form.
  public postRegister(first_name, last_name, email, pass, confirmPass, phone_no, gender) {
    let param = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      pass: pass,
      confirmPass: confirmPass,
      phone_no: phone_no,
      gender: gender
    }
    return this.httpClient.post(this.baseUrl + `register`, param).map(data => data);
  }

  //Posting the details of Address Form.
  public postAddress(address, pincode, city, state, country, authorizationToken) {
    let param = {
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      country: country
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.post(this.baseUrl + `address`, param, this.httpOptions).map(data => data);
  }

  //Posting the change password details of Change Password Form.
  public postChangePassword(oldPass, newPass, confirmPass, authorizationToken) {
    let param = {
      oldPass: oldPass,
      newPass: newPass,
      confirmPass: confirmPass
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.post(this.baseUrl + `changePassword`, param, this.httpOptions).map(data => data);
  }

  //Posting the product details when add to cart.
  public postAddProductToCartCheckout(productToAdd, authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.post(this.baseUrl + `addProductToCartCheckout`, productToAdd, this.httpOptions).map(data => data);
  }

  //Posting the email id for forgetpassword on Forget Password Form.
  public postForgotPassword(email) {
    let param = {
      email: email
    }
    return this.httpClient.post(this.baseUrl + `forgotPassword`, param).map(data => data);
  }

  //Posting the otpCode and new password for recoverpassword on Forget Password Form.
  public postRecoverPassword(otpCode, newPass, confirmPass, verifiedToken) {
    let param = {
      otpCode: otpCode,
      newPass: newPass,
      confirmPass: confirmPass
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': verifiedToken
      })
    };
    return this.httpClient.post(this.baseUrl + `recoverPassword`, param, this.httpOptions).map(data => data);
  }

  //Updating the Ratings of Product using Product Id on Product Details.
  public putUpdateProductRatingByCustomer(product_id, product_rating, authorizationToken) {
    let param = {
      product_id: product_id,
      product_rating: product_rating
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.put(this.baseUrl + `updateProductRatingByCustomer`, param, this.httpOptions).map(data => data);
  }

  //Updating the Customer Address on Edit Address Form.
  public putUpdateAddress(address_id, address, pincode, city, state, country, isDeliveryAddress, authorizationToken) {
    let param = {
      address_id: address_id,
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      country: country,
      isDeliveryAddress: isDeliveryAddress
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.put(this.baseUrl + `updateAddress`, param, this.httpOptions).map(data => data);
  }

  // //Updating the Profile Details on Edit Profile Form.
  // public putProfile(formData, authorizationToken) {
  //   // let param = {
  //   //   profile_img: formData.profile_img,
  //   //   first_name: formData.first_name,
  //   //   last_name: formData.last_name,
  //   //   email: formData.email,
  //   //   dob: formData.dob,
  //   //   phone_no: formData.phone_no,
  //   //   gender: formData.gender
  //   // }
  //   this.httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': authorizationToken
  //     })
  //   };
  //   return this.httpClient.put(this.baseUrl + `profile`, formData, this.httpOptions).map(data => data);
  // }

  //Updating the Profile Details on Edit Profile Form.
  public putProfile(first_name, last_name, email, dob, phone_no, gender, authorizationToken) {
    let param = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      dob: dob,
      phone_no: phone_no,
      gender: gender
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.put(this.baseUrl + `profile`, param, this.httpOptions).map(data => data);
  }

  //Deleting the Customer Address from Profile Section
  public deleteDeladdress(address_id, authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.delete(this.baseUrl + `deladdress` + `/` + address_id, this.httpOptions).map(data => data);
  }

  //Deleting the Product from Cart
  public deleteCustomerCart(product_id, authorizationToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationToken
      })
    };
    return this.httpClient.delete(this.baseUrl + `deleteCustomerCart` + `/` + product_id, this.httpOptions).map(data => data);
  }

}