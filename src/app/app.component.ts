import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as user from './actions/user.actions';
import * as fromRoot from './reducers';

@Component({
  selector: 'neko-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.loggedIn$ = store.select(fromRoot.isUserLoggedIn);
  }

  ngOnInit(): void {
    this.store.dispatch(new user.LoadAction());
  }

  logout(): void {
    this.store.dispatch(new user.LogoutAction());
  }
}
