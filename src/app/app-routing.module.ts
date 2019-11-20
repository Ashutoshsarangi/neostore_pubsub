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
import { AuthService } from './Services/auth.service';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [

  { path: '', component: CategoriesCarouselComponent },
  { path: 'categories-carousel', component: CategoriesCarouselComponent },

  { path: 'add-address', component: AddAddressComponent, canActivate: [AuthGuard] },
  { path: 'cart/add-address', component: AddAddressComponent, canActivate: [AuthGuard] },
  { path: 'add-address/:address_id', component: AddAddressComponent, canActivate: [AuthGuard] },
  { path: 'profile/add-address/:address_id', component: AddAddressComponent, canActivate: [AuthGuard] },
  { path: 'profile/add-address', component: AddAddressComponent, canActivate: [AuthGuard] },

  { path: 'allproducts', component: AllproductsComponent },
  { path: 'allproducts/:category_id/:category_name', component: AllproductsComponent },
  { path: 'categories-carousel/allproducts', component: AllproductsComponent },
  { path: 'cart/allproducts', component: AllproductsComponent },

  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },

  { path: 'contactform', component: ContactformComponent, canActivate: [AuthGuard] },

  { path: 'footersection', component: FootersectionComponent },

  { path: 'login/forgotpassword', component: ForgotpasswordComponent },

  { path: 'loader', component: LoaderComponent },

  { path: 'locateus', component: LocateusComponent },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },

  { path: 'navigationbar', component: NavigationbarComponent },

  { path: 'cart/order-placed', component: OrderPlacedComponent, canActivate: [AuthGuard] },
  { path: 'order-placed/:order_id/:address_id', component: OrderPlacedComponent, canActivate: [AuthGuard] },

  { path: 'productdetails/:id', component: ProductdetailsComponent },

  { path: 'login/register', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:option', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'cart/add-address/profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'thankyou-subscribing/:email', component: ThankyouSubscribingComponent, canActivate: [AuthGuard] },

  { path: '404', component: CategoriesCarouselComponent },
  { path: '**', redirectTo: '/categories-carousel' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard]
})
export class AppRoutingModule { }