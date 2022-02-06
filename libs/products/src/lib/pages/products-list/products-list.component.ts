import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category-model';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage!: boolean;
  endsub$: Subject<any> = new Subject();

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
      params.categoryid ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
    });
    this._getCategories();
  }

  ngOnDestroy() {
    this.endsub$.next();
    this.endsub$.complete();
  }

  private _getProducts(categoriesFilter?: any[]) {
    this.productsService.getProducts(categoriesFilter).pipe(takeUntil(this.endsub$)).subscribe((products) => {
      this.products = products;
    });
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsub$)).subscribe((categories) => {
      this.categories = categories;
    });
  }

  categoryFilter() {
    const selectedCategories = this.categories.filter(category => category.checked).map(category => category.id);

    this._getProducts(selectedCategories)
  }

}
