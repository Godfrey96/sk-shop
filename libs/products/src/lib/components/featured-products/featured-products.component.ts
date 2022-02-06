import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from './../../services/products.service';

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [
  ]
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {

  featuredProducts: Product[] = [];
  endsub$: Subject<any> = new Subject();

  constructor(
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  ngOnDestroy() {
    this.endsub$.next();
    this.endsub$.complete();
  }

  private _getFeaturedProducts() {
    this.productService.getFeaturedProducts(4)
      .pipe(takeUntil(this.endsub$))
      .subscribe((products) => {
        this.featuredProducts = products;
      });
  }

}
