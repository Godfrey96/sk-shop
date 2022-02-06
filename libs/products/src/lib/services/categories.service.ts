import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category-model';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  apiURLCategories = environment.apiURL + 'categories'

  constructor(private http: HttpClient) { }

  // get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories);
  }

  // get single category
  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);
  }

  // add new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category);
  }

  // update category
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiURLCategories}/${category.id}`, category);
  }

  // delete category
  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCategories}/${categoryId}`);
  }
}
