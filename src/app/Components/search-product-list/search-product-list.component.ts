import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StarRatingComponent } from 'ng-starrating';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

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
    private auth: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.allProductsDetailsArray = JSON.parse(JSON.stringify(this.data)).array;
  }

  goToAllProducts(data) {
    this.dialogRef.close();
    //this.router.navigateByUrl('/allproducts', { skipLocationChange: true });
    //setTimeout(() => this.router.navigate(['/allproducts/', data.product_id, data.category_id.category_id, data.category_id.category_name, data.color_id.color_id]));
    this.router.navigate(['/allproducts/', data._id, data.category_id.category_id, data.category_id.category_name, data.color_id.color_id]);
  }

}