import { Component, OnInit } from '@angular/core';
import { Order, OrdersService, ORDER_STATUS } from '@skomane/orders';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit {

  orders: Order[] = [];
  orderStatus = ORDER_STATUS;

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }

  // get list of orders
  private _getOrders() {
    this.orderService.getOrders().subscribe((order) => {
      this.orders = order;
    })
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrder(orderId).subscribe(() => {
          this._getOrders();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order is deleted'
          });
        },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order is not deleted'
            });
          });
      },
    });
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

}
