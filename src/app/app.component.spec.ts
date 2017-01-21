/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsTestingModule } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { AppComponent } from './app.component';
import { UserService } from './core/user.service';
import * as fromRoot from './reducers';
import { UserEffects } from './effects/user.effects';

const userMethods = [
  'auth'
];

describe('AppComponent', () => {
  let userService: UserService;
  let userEffects: UserEffects;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('user', userMethods);
    mockUserService.auth.and.returnValue(of(null));

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        EffectsTestingModule,
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
    });

    TestBed.compileComponents();

    inject([UserService, UserEffects], (service: UserService, effects: UserEffects) => {
      userService = service;
      userEffects = effects;
    })();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'neko works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('neko works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('neko works!');
  }));

  describe('NgOnInit', () => {
    it('should call auth mehotd on user service', () => {
      userEffects.load$.subscribe(() => {
        expect(userService.auth).toHaveBeenCalled();
      });
    });
  });
});
