import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as user from './actions/user.actions';
import * as fromRoot from './reducers';

@Component({
  selector: 'neko-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'neko works!';

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.store.dispatch(new user.LoadAction());
  }
}
