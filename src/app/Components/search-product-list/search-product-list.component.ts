import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StarRatingComponent } from 'ng-starrating';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-search-product-list',
  templateUrl: './search-product-list.component.html',
  styleUrls: ['./search-product-list.component.scss']
})
export class SearchProductListComponent implements OnInit {

  searchText = "";
  allProductsDetailsArray;

  constructor(
    public dialogRef: MatDialogRef<SearchProductListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    console.log("ENTEREED INTO SEARCH PRODUCT LIST")
    this.allProductsDetailsArray = JSON.parse(JSON.stringify(this.data)).array;
  }

}