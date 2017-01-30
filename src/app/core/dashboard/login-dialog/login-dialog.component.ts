import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { FormService } from '../../../shared/form.service';
import * as user from '../../../actions/user.actions';
import * as fromRoot from '../../../reducers';
import { emailValidator } from '../../../validators/email.validator';
import { passwordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'neko-core-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  providers: [ FormService ]
})
export class LoginDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loggedIn$: Observable<boolean>;
  loggedInSubscription: Subscription;

  constructor(private mdDialogRef: MdDialogRef<LoginDialogComponent>,
              private store: Store<fromRoot.State>, private fService: FormService) {
    this.loggedIn$ = store.select(fromRoot.isUserLoggedIn);
  }

  ngOnInit(): void {
    this.loggedInSubscription = this.loggedIn$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.mdDialogRef.close();
      }
    });

    // TODO: Add to i18n on available angular/angular#11405
    this.fService.validationMessages = {
      email: {
        required: 'El correo electrónico es obligatorio',
        invalidEmail: 'El correo electrónico introducido no es válido'
      },
      password: {
        required: 'La contraseña es obligatoria',
        invalidPassword: 'La contraseña introducida no es válida, debe tener al menos %(minLength)d carácteres'
      },
    };

    this.form = this.fService.group({
      email: ['', [
        Validators.required,
        emailValidator
      ]],
      password: ['', [
        Validators.required,
        passwordValidator
      ]]
    });
  }

  ngOnDestroy(): void {
    this.fService.removeSubscriptions();
    this.loggedInSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(new user.LoginAction(this.form.value));
    }
  }

  get errors(): { [key: string]: string } {
    return this.fService.formErrors;
  }
}
