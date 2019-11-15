import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thankyou-subscribing',
  templateUrl: './thankyou-subscribing.component.html',
  styleUrls: ['./thankyou-subscribing.component.scss']
})
export class ThankyouSubscribingComponent implements OnInit {

  email: any;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
  }

}