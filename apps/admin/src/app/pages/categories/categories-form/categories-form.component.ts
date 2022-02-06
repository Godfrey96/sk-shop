import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@skomane/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {

  form!: FormGroup;
  isSubmitted = false;
  editmode = false;
  currentCategoryId!: string;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addCategoryForm();
    this.checkEditMode();
  }

  // form
  addCategoryForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    });
  }

  // errors
  get categoryForm() {
    return this.form.controls;
  }

  // check edit mode
  private checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.editmode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id).subscribe(category => {
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
          this.categoryForm.color.setValue(category.color);
        })
      }
    })
  }

  // add/create category
  private addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe((category: Category) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Category ${category.name} is created`
      });
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Category is not created'
        });
      });
  }

  // edit/update category
  private updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Category is updated`
      });
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Category is not updated'
        });
      });
  }

  // cancel btn
  onCancle() {
    this.location.back();
  }

  // submit
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    }

    if (this.editmode) {
      this.updateCategory(category)
    } else {
      this.addCategory(category)
    }
  }

}
