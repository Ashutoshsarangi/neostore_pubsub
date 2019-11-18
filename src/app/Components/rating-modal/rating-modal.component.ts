import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StarRatingComponent } from 'ng-starrating';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss']
})
export class RatingModalComponent implements OnInit {

  productRating;

  doneButtonColor = "#DEDEDE";
  doneButtonTextColor = "#A3A3A3";
  doneButtonBorder = "1px solid #DEDEDE";
  doneButton: boolean = false;

  authorizationToken;

  rating;

  constructor(
    public dialogRef: MatDialogRef<RatingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.rating = JSON.parse(JSON.stringify(this.data)).product_rating;
    }
    else {
      this.auth.logout();
      Swal.fire("Please Login First!");
    }
  }

  onRate($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }) {
    if ($event.newValue > 0) {
      this.productRating = $event.newValue;
      this.doneButtonColor = "#4A3DB5";
      this.doneButtonTextColor = "#FFFFFF";
      this.doneButtonBorder = "1px solid #000000";
      this.doneButton = true;
    }
  }

  close() {
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userDetails')) {
      this.authorizationToken = "Bearer " + JSON.parse(localStorage.getItem('userDetails')).token;
      this.apiService.putUpdateProductRatingByCustomer(this.data.product_id, this.productRating, this.authorizationToken).subscribe((response) => {
        this.dialogRef.close(this.productRating);
        Swal.fire("Great !", JSON.parse(JSON.stringify(response)).product_details[0].product_rating, "success");
      },
        (error) => {
          Swal.fire('Oops...', error.error.message, 'error');
        });
    }
  }

}