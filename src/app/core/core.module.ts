import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginDialogComponent } from './dashboard/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './dashboard/register-dialog/register-dialog.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [
    LayoutComponent,
    DashboardComponent,
    LoginDialogComponent,
    RegisterDialogComponent
  ],
  exports: [
    LayoutComponent,
    DashboardComponent
  ],
  entryComponents: [
    LoginDialogComponent,
    RegisterDialogComponent
  ],
  providers: [
    NotificationService,
    UserService
  ]
})
export class CoreModule { }
