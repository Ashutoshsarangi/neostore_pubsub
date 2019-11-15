import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { RatingModalComponent } from './Components/rating-modal/rating-modal.component';
import { RegisterComponent } from './Components/register/register.component';
import { ThankyouSubscribingComponent } from './Components/thankyou-subscribing/thankyou-subscribing.component';
import { LoaderInterceptor } from './Interceptors/loader.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './Services/api.service';
import { LoaderService } from './Services/loader.service';
import { SocialloginService } from './Services/sociallogin.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RatingModule } from 'ng-starrating';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('482174532382575') //APP ID : 482174532382575
  },                                                       //APP SECRET : 0f3f143bc245a7e9616fe41ebd2bdd60
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('516168763701-jlhrcoull71lrs47aeoesv24s1ksspls.apps.googleusercontent.com') //CLIENT ID : 516168763701-jlhrcoull71lrs47aeoesv24s1ksspls.apps.googleusercontent.com
  }                                                      //CLIENT SECRET : mUtpNGZznj-N9tytIX0CYXKe
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    AddAddressComponent,
    AllproductsComponent,
    CartComponent,
    CategoriesCarouselComponent,
    ContactformComponent,
    FootersectionComponent,
    ForgotpasswordComponent,
    LoaderComponent,
    LocateusComponent,
    LoginComponent,
    NavigationbarComponent,
    ProductdetailsComponent,
    ProfileComponent,
    RatingModalComponent,
    RegisterComponent,
    ThankyouSubscribingComponent,
    JwPaginationComponent,
    AddAddressComponent,
    OrderPlacedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RatingModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatRadioModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgxImageZoomModule.forRoot(),
    JwSocialButtonsModule,
    SocialLoginModule
  ],
  entryComponents: [
    RatingModalComponent
  ],
  providers: [
    ApiService,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    SocialloginService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }