import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private myRoute: Router) { }

  sendToken(token: string) {
    localStorage.setItem("userToken", token)
  }

  getToken() {
    return localStorage.getItem("userToken")
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem("userToken");
    this.myRoute.navigate(["login"]);
  }

}