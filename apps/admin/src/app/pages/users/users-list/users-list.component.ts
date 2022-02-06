import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UsersService } from '@skomane/users';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit {

  users: User[] = [];

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getUsers();
  }

  private _getUsers() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this User?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).subscribe(() => {
          this._getUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Summary',
            detail: 'User is deleted!'
          });
        },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User is not deleted!'
            });
          }
        );
      }
    });
  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`)
  }

  getCountryName(countryKey: string) {
    if (countryKey) {
      return this.usersService.getCountry(countryKey);
    } else {
      return;
    }
  }

}
