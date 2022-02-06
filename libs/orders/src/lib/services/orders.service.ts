import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { OrderItem } from '../models/order-item';
import { StripeService } from 'ngx-stripe'

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  apiURLOrders = environment.apiURL + 'orders'
  apiURLProducts = environment.apiURL + 'products'

  constructor(
    private http: HttpClient,
    private stripeService: StripeService
  ) { }

  // get all orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders);
  }

  // get single order
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
  }

  // add new order
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order);
  }

  // update order
  updateOrder(orderStatus: { status: string }, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus);
  }

  // delete order
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
  }

  // get orders count
  getOrdersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  // get orders totals
  getTotalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  // get single product
  getProduct(productId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
  }

  // create checkout session
  createCheckoutSession(orderItem: OrderItem[]) {
    return this.http.post(`${this.apiURLOrders}/create-checkout-session`, orderItem).pipe(
      switchMap((session: any) => {
        return this.stripeService.redirectToCheckout({ sessionId: session.id })
      })
    );
  }

  // Catch order
  cacheOrderData(order: Order) {
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  // retrieve catched order data
  getCachedOrderData(): Order {
    const orderDataString: any = localStorage.getItem('orderData')
    const orderData: Order = JSON.parse(orderDataString)
    return orderData;

    // return JSON.parse(localStorage.getItem('orderData'));
  }

  removeCatchedOrderData() {
    localStorage.removeItem('orderData');
  }

}
