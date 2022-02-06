import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@skomane/products';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getListOfCategories();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  // get list of categories
  private getListOfCategories() {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.endsubs$))
      .subscribe(cats => {
        this.categories = cats;
      });
  }

  // delete category
  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(categoryId).subscribe((response) => {
          this.getListOfCategories();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category is deleted'
          });
        },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category is not deleted'
            });
          });
      },
    });
  }

  // update category
  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`)
  }

}
