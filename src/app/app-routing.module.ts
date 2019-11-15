import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAddressComponent } from './Components/add-address/add-address.component';
import { AllproductsComponent } from './Components/allproducts/allproducts.component';
import { CartComponent } from './Components/cart/cart.component';
import { CategoriesCarouselComponent } from './Components/categories-carousel/categories-carousel.component';
import { ContactformComponent } from './Components/contactform/contactform.component';
import { FootersectionComponent } from './Components/footersection/footersection.component';
import { ForgotpasswordComponent } from './Components/forgotpassword/forgotpassword.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { LocateusComponent } from './Components/locateus/locateus.component';
import { LoginComponent } from './Components/login/login.component';
import { NavigationbarComponent } from './Components/navigationbar/navigationbar.component';
import { OrderPlacedComponent } from './Components/order-placed/order-placed.component';
import { ProductdetailsComponent } from './Components/productdetails/productdetails.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { ThankyouSubscribingComponent } from './Components/thankyou-subscribing/thankyou-subscribing.component';

const routes: Routes = [
  { path: '', component: CategoriesCarouselComponent },
  { path: 'cart/add-address', component: AddAddressComponent },
  { path: 'add-address/:address_id', component: AddAddressComponent },
  { path: 'profile/add-address/:address_id', component: AddAddressComponent },
  { path: 'profile/add-address', component: AddAddressComponent },
  { path: 'allproducts', component: AllproductsComponent },
  { path: 'allproducts/:category_id/:category_name', component: AllproductsComponent },
  { path: 'categories-carousel/allproducts', component: AllproductsComponent },
  { path: 'cart/allproducts', component: AllproductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'categories-carousel', component: CategoriesCarouselComponent },
  { path: 'contactform', component: ContactformComponent },
  { path: 'footersection', component: FootersectionComponent },
  { path: 'login/forgotpassword', component: ForgotpasswordComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'locateus', component: LocateusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'navigationbar', component: NavigationbarComponent },
  { path: 'cart/order-placed', component: OrderPlacedComponent },
  { path: 'order-placed/:order_id/:address_id', component: OrderPlacedComponent },
  { path: 'productdetails/:id', component: ProductdetailsComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:option', component: ProfileComponent },
  { path: 'cart/add-address/profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'thankyou-subscribing/:email', component: ThankyouSubscribingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }