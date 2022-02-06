import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment.prod';
import * as COUNTRIESLIB from 'i18n-iso-countries';
import { UsersFacade } from '../state/users.facade';

declare const require: (arg0: string) => COUNTRIESLIB.LocaleData;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURLUsers = environment.apiURL + 'users'

  constructor(
    private http: HttpClient,
    private usersFacade: UsersFacade
  ) {
    COUNTRIESLIB.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  // get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  // get single user
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  // add new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUsers, user);
  }

  // update user
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
  }

  // delete user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(COUNTRIESLIB.getNames('en', { select: 'official' })).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return COUNTRIESLIB.getName(countryKey, 'en');
  }

  // get users count
  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

  initAppSession() {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser() {
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuthenticated() {
    return this.usersFacade.isAuthenticated$;
  }

}
