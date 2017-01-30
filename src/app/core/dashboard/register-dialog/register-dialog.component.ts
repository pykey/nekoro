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
import { sameAsValidator } from '../../../validators/sameAs.validator';
import { usernameValidator } from '../../../validators/username.validator';

@Component({
  selector: 'neko-core-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
  providers: [ FormService ]
})
export class RegisterDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loggedIn$: Observable<boolean>;
  loggedInSubscription: Subscription;

  constructor(private mdDialogRef: MdDialogRef<RegisterDialogComponent>,
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
      username: {
        required: 'El nombre de usuario es obligatorio',
        invalidUsername: 'El nombre de usuario introducido no es válido, debe tener entre %(minLength)d y %(maxLength)d carácteres'
      },
      email: {
        required: 'El correo electrónico es obligatorio',
        invalidEmail: 'El correo electrónico introducido no es válido'
      },
      repeatEmail: {
        required: 'Es necesario repetir el correo electrónico',
        notSameAs: 'El correo electrónico no coincide'
      },
      password: {
        required: 'La contraseña es obligatoria',
        invalidPassword: 'La contraseña introducida no es válida, debe tener al menos %(minLength)d carácteres'
      },
      repeatPassword: {
        required: 'Es necesario repetir la contraseña',
        notSameAs: 'La contraseña no coincide'
      }
    };

    this.form = this.fService.group({
      username: ['', [
        Validators.required,
        usernameValidator
      ]],
      email: ['', [
        Validators.required,
        emailValidator
      ]],
      repeatEmail: ['', [
        Validators.required,
        sameAsValidator('email')
      ]],
      password: ['', [
        Validators.required,
        passwordValidator
      ]],
      repeatPassword: ['', [
        Validators.required,
        sameAsValidator('password')
      ]]
    });
  }

  ngOnDestroy(): void {
    this.fService.removeSubscriptions();
    this.loggedInSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(new user.RegisterAction(this.form.value));
    }
  }

  get errors(): { [key: string]: string } {
    return this.fService.formErrors;
  }
}
