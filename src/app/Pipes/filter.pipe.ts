import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allProductsDetailsArray: any[], searchText: string): any[] {

    console.log("PRODUCT ARRAYS");
    console.log(allProductsDetailsArray);

    if (!allProductsDetailsArray) {
      return [];
    }

    if (!searchText) {
      return allProductsDetailsArray;
    }

    searchText = searchText.toLowerCase();

    return allProductsDetailsArray.filter(productObject => {
      let searchResult = (productObject.product_name.toLowerCase().includes(searchText));
      return searchResult;
    });

  }

}