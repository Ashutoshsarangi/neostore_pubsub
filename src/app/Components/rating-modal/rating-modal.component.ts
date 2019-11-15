import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StarRatingComponent } from 'ng-starrating';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss']
})
export class RatingModalComponent implements OnInit {

  productRating;

  doneButtonColor = "#DEDEDE";
  doneButtonTextColor = "#A3A3A3";

  authorizationToken;

  constructor(
    public dialogRef: MatDialogRef<RatingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
  ) {

  }

  ngOnInit() {

  }

  onRate($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }) {
    if ($event.newValue > 0) {
      this.productRating = $event.newValue;
      this.doneButtonColor = "#3D40A1";
      this.doneButtonTextColor = "#FFFFFF";
    }
  }

  close() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.putUpdateProductRatingByCustomer(this.data.product_id, this.productRating, this.authorizationToken).subscribe((response) => {
        this.dialogRef.close(this.productRating);
        window.alert("Successfully Rated !! Average Rating is " + JSON.parse(JSON.stringify(response)).product_details[0].product_rating);
      },
        (error) => {
          window.alert("OOPS");
        });
    }
  }

}