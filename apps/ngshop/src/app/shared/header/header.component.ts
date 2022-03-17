import { Component, OnInit } from '@angular/core';
import { AuthService, UsersFacade } from '@skomane/users';
import { LocalstorageService } from 'libs/users/src/lib/services/localstorage.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html'
  // styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // user = false;
  user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    private usersFacade: UsersFacade
  ) { }

  ngOnInit(): void {
    this.observeCurrentUser();
  }

  signout() {
    this.authService.logout();
  }

  observeCurrentUser() {
    // this.user = true;
    this.user$ = this.localStorageService.getToken();
    console.log('userr token: ', this.user$)
  }

}
