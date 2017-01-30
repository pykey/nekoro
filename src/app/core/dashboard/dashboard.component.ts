import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';

@Component({
  selector: 'neko-core-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() loggedIn: boolean;
  @Output() logout: EventEmitter<null> = new EventEmitter();

  constructor(public mdDialog: MdDialog) { }

  doLogin(): void {
    this.mdDialog.open(LoginDialogComponent);
  }

  doRegister(): void {
    this.mdDialog.open(RegisterDialogComponent);
  }

  doLogout(): void {
    this.logout.emit(null);
  }
}
