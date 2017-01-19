import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

import { reducer } from './reducers';

export const firebaseConfig = environment.firebaseConfig;
export const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),

    RouterStoreModule.connectRouter(),
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),

    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),

    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
