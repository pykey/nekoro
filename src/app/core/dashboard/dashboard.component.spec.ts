import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MaterialModule, MdDialog } from '@angular/material';

import { DashboardComponent } from './dashboard.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';

const mdDialogMethods = [
  'open'
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockMdDialog: any;

  beforeEach(async(() => {
    mockMdDialog = jasmine.createSpyObj('mdDialog', mdDialogMethods);

    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [
        MaterialModule.forRoot()
      ],
      providers: [
        {
          provide: MdDialog,
          useValue: mockMdDialog
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DoLogin', () => {
    it('should open Login Dialog', () => {
      component.doLogin();

      expect(mockMdDialog.open).toHaveBeenCalledWith(LoginDialogComponent);
    });
  });

  describe('DoRegister', () => {
    it('should open Register Dialog', () => {
      component.doRegister();

      expect(mockMdDialog.open).toHaveBeenCalledWith(RegisterDialogComponent);
    });
  });

  describe('DoLogout', () => {
    it('should emit logout event', done => {
      component.logout.subscribe(done);

      component.doLogout();
    }, 10);
  });
});
