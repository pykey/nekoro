import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsTestingModule } from '@ngrx/effects/testing';
import { MaterialModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { AppComponent } from './app.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { LayoutComponent } from './core/layout/layout.component';
import { UserService } from './core/user.service';
import { UserEffects } from './effects/user.effects';
import * as fromRoot from './reducers';

const userMethods = [
  'auth',
  'logout'
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userService: UserService;
  let userEffects: UserEffects;
  let mockUserService: any;

  beforeEach(async(() => {
    mockUserService = jasmine.createSpyObj('user', userMethods);
    mockUserService.auth.and.returnValue(of(null));
    mockUserService.logout.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DashboardComponent,
        LayoutComponent
      ],
      imports: [
        EffectsTestingModule,
        MaterialModule.forRoot(),
        StoreModule.provideStore(fromRoot.reducer),
        RouterTestingModule
      ],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        UserEffects
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inject([UserService, UserEffects], (service: UserService, effects: UserEffects) => {
      userService = service;
      userEffects = effects;
    })();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('NgOnInit', () => {
    it('should call auth method on user service', () => {
      userEffects.load$.subscribe(() => {
        expect(userService.auth).toHaveBeenCalled();
      });
    });
  });

  describe('Logout', () => {
    it('should call logout method from user service', () => {
      component.logout();

      userEffects.logout$.subscribe(() => {
        expect(userService.logout).toHaveBeenCalled();
      });
    });
  });
});
