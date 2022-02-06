import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@skomane/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit {

  form!: FormGroup;
  isSubmitted = false;
  editmode = false;
  catagories: Category[] = [];
  imageDisplay: string | ArrayBuffer | undefined;
  currentProductId!: string;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.catagories = categories;
    })
  }

  // check edit mode whether its create or update
  private _checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.editmode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).subscribe((product) => {
          this.productForm.name.setValue(product.name);
          this.productForm.brand.setValue(product.brand);
          this.productForm.price.setValue(product.price);
          this.productForm.category.setValue(product.category?.id);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        })
      }
    })
  }

  // errors
  get productForm() {
    return this.form.controls;
  }


  // cancel btn
  onCancle() {
    this.location.back();
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as string
      }
      fileReader.readAsDataURL(file);
    }
  }

  // add/create product
  private _addProduct(productData: FormData) {
    this.productsService.createProduct(productData).subscribe((product: Product) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Product ${product.name} is created`
      });
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product is not created'
        });
      });
  }

  // edit/update category
  private _updateProduct(productData: FormData) {
    this.productsService.updateProduct(productData, this.currentProductId).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Product is updated`
      });
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product is not updated'
        });
      });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });

    if (this.editmode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  }

}
