import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, User } from '@skomane/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import * as COUNTRIESLIB from 'i18n-iso-countries';
import { ActivatedRoute, Router } from '@angular/router';

declare const require: (arg0: string) => COUNTRIESLIB.LocaleData;

@Component({
  selector: 'users-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  Registerform!: FormGroup;
  isSubmitted = false;
  editmode = false;
  currentUserId!: string;
  countries: any[] = [];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initUserForm();
    this._getCountries();
    this._checkEditMode();
  }

  private _initUserForm() {
    this.Registerform = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    });
  }

  private _getCountries() {
    COUNTRIESLIB.registerLocale(require("i18n-iso-countries/langs/en.json"));
    this.countries = Object.entries(COUNTRIESLIB.getNames("en", { select: "official" })).map(entry => {
      return {
        id: entry[0],
        name: entry[1]
      }
    });
  }

  private _addUser(user: User) {
    this.usersService.createUser(user).subscribe((user: User) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `User ${user.name} is created!`
      });
      timer(2000).toPromise().then(() => {
        // this.location.back();
        this.router.navigate(['/login']);
      });
    },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `User is not created!`
        });
      }
    );
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User is updated!'
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not updated!'
        });
      }
    );
  }

  private _checkEditMode() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe((user) => {
          this.userForm.name.setValue(user.name);
          this.userForm.email.setValue(user.email);
          this.userForm.phone.setValue(user.phone);
          this.userForm.isAdmin.setValue(user.isAdmin);
          this.userForm.street.setValue(user.street);
          this.userForm.apartment.setValue(user.apartment);
          this.userForm.zip.setValue(user.zip);
          this.userForm.city.setValue(user.city);
          this.userForm.country.setValue(user.country);

          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        });
      }
    });
  }

  // errors
  get userForm() {
    return this.Registerform.controls;
  }

  onCancle() {
    this.location.back();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.Registerform.invalid) {
      return;
    }

    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      password: this.userForm.password.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value
    };

    if (this.editmode) {
      this._updateUser(user);
    } else {
      this._addUser(user)
    }

  }

}
