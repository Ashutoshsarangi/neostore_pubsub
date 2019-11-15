import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locateus',
  templateUrl: './locateus.component.html',
  styleUrls: ['./locateus.component.scss']
})
export class LocateusComponent implements OnInit {

  public map: any = { lat: 51.678418, lng: 7.809007 };

  constructor() { }

  ngOnInit() {
  }

}