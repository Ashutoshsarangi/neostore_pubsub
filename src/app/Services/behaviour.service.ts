import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BehaviourService {

  private cartCount = new Subject<any>();
  private loginStatus = new Subject<any>();

  setCount(count: string) {
    this.cartCount.next({ value: count });
  }

  getCount(): Observable<any> {
    return this.cartCount.asObservable();
  }

  clearCount() {
    this.cartCount.next();
  }

  setLogin(login: string) {
    this.loginStatus.next({ value: login });
  }

  getLogin(): Observable<any> {
    return this.loginStatus.asObservable();
  }

  clearLogin() {
    this.loginStatus.next();
  }

}