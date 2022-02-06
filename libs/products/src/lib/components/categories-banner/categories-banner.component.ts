import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category-model';
import { CategoriesService } from './../../services/categories.service';


@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endsub$: Subject<any> = new Subject();

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this._getCategories();
  }

  ngOnDestroy() {
    this.endsub$.next();
    this.endsub$.complete();
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endsub$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

}
