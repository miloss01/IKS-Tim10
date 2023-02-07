import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginAuthentificationService } from '../service/login-authentification.service';
import { Observable, of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<LoginAuthentificationService>
  let matDialogSpy: jasmine.SpyObj<MatDialog>
  let router: any

  // sa ovom komandom se pokrece samo ovaj test ng test --include=**/login.component.spec.ts

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj<LoginAuthentificationService>(["login", "getRole", "setUser", "changeActiveFlag", "addWorkingHour"]);
    matDialogSpy = jasmine.createSpyObj<MatDialog>(["open"])

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: LoginAuthentificationService, useValue: authServiceSpy },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.removeItem('user')
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login passenger', () => {
    authServiceSpy.login.withArgs({email: "nana@DEsi.com", password: "333"}).and.returnValue(of({accessToken: "nana token", refreshToken: "nema"}))
    authServiceSpy.getRole.and.returnValue("PASSENGER")
    authServiceSpy.setUser.and.returnValue(undefined)
    authServiceSpy.changeActiveFlag.withArgs(true).and.returnValue(of({}))
    authServiceSpy.addWorkingHour.and.returnValue(of({}))
    component.loginForm.patchValue({username: "nana@DEsi.com", password: "333"})

    component.loginUser()

    expect(router.navigate).toHaveBeenCalledWith(['/book-ride'])
    expect(JSON.parse(localStorage.getItem("user")!)).toBe('nana token')
    
  })

  it('should login driver', () => {
    authServiceSpy.login.withArgs({email: "boki@DEsi.com", password: "333"}).and.returnValue(of({accessToken: "boki token", refreshToken: "nema"}))
    authServiceSpy.getRole.and.returnValue("DRIVER")
    authServiceSpy.setUser.and.returnValue(undefined)
    authServiceSpy.changeActiveFlag.withArgs(true).and.returnValue(of({}))
    authServiceSpy.addWorkingHour.and.returnValue(of({}))
    component.loginForm.patchValue({username: "boki@DEsi.com", password: "333"})

    component.loginUser()

    expect(router.navigate).toHaveBeenCalledWith(['/'])
    expect(JSON.parse(localStorage.getItem("user")!)).toBe('boki token')
    
  })

  it('should login admin', () => {
    authServiceSpy.login.withArgs({email: "dmina@gmail.com", password: "333"}).and.returnValue(of({accessToken: "dmina token", refreshToken: "nema"}))
    authServiceSpy.getRole.and.returnValue("ADMIN")
    authServiceSpy.setUser.and.returnValue(undefined)
    authServiceSpy.changeActiveFlag.withArgs(true).and.returnValue(of({}))
    authServiceSpy.addWorkingHour.and.returnValue(of({}))
    component.loginForm.patchValue({username: "dmina@gmail.com", password: "333"})

    component.loginUser()

    expect(router.navigate).toHaveBeenCalledWith(['/'])
    expect(JSON.parse(localStorage.getItem("user")!)).toBe('dmina token')
    
  })

  it('should write error message bacause of bad password', () => {
    authServiceSpy.login.withArgs({email: "dmina@gmail.com", password: "222"}).and.returnValue(throwError(() => new HttpErrorResponse({error: {message: "Wrong username or password"}})))

    authServiceSpy.getRole.and.returnValue("ADMIN")
    authServiceSpy.setUser.and.returnValue(undefined)
    authServiceSpy.changeActiveFlag.withArgs(true).and.returnValue(of({}))
    authServiceSpy.addWorkingHour.and.returnValue(of({}))
    component.loginForm.patchValue({username: "dmina@gmail.com", password: "222"})

    component.loginUser()

    expect(router.navigate).toHaveBeenCalledTimes(0)
    expect(localStorage.getItem("user")).toBe(null)
    expect(component.errorMessage).toBe("Wrong username or password")

    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector("p").innerText).toBe("Wrong username or password")
    
  })

  it('should write error message bacause of nonexistent email', () => {
    authServiceSpy.login.withArgs({email: "non@gmail.com", password: "222"}).and.returnValue(throwError(() => new HttpErrorResponse({error: {message: "Wrong username or password"}})))

    authServiceSpy.getRole.and.returnValue("PASSENGER")
    authServiceSpy.setUser.and.returnValue(undefined)
    authServiceSpy.changeActiveFlag.withArgs(true).and.returnValue(of({}))
    authServiceSpy.addWorkingHour.and.returnValue(of({}))
    component.loginForm.patchValue({username: "non@gmail.com", password: "222"})

    component.loginUser()

    expect(router.navigate).toHaveBeenCalledTimes(0)
    expect(localStorage.getItem("user")).toBe(null)
    expect(component.errorMessage).toBe("Wrong username or password")

    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector("p").innerText).toBe("Wrong username or password")
    
  })

  it('should redirect to register page', () => {

    component.goToRegister()
    expect(router.navigate).toHaveBeenCalledWith(['/register-account'])
    
  })

  it('should open reset password dialog', () => {

    component.openResetPasswordDialog()
    expect(matDialogSpy.open).toHaveBeenCalledTimes(1)
    
  })

});
