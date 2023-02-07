import { HttpErrorResponse } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { AppUserService } from 'src/app/services/app-user.service'

import { RegisterAccountComponent } from './register-account.component'

describe('RegisterAccountComponent', () => {
  let component: RegisterAccountComponent
  let fixture: ComponentFixture<RegisterAccountComponent>
  let authServiceSpy: jasmine.SpyObj<AppUserService>

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AppUserService>(['addPassenger'])

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RegisterAccountComponent],
      providers: [
        { provide: AppUserService, useValue: authServiceSpy }
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(RegisterAccountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(component.errorMessage).toEqual('')
  })

  it('should be valid form', () => {
    component.registerAccountForm.controls.name.setValue('ime')
    component.registerAccountForm.controls.surname.setValue('ime')
    component.registerAccountForm.controls.telephoneNumber.setValue('ime')
    component.registerAccountForm.controls.email.setValue('ime@gmail.com')
    component.registerAccountForm.controls.address.setValue('ime')
    component.registerAccountForm.controls.password.setValue('ime')
    component.registerAccountForm.controls.confirmPassword.setValue('ime')
    expect(component.registerAccountForm.valid).toBeTruthy()
    authServiceSpy.addPassenger.withArgs({
      name: component.registerAccountForm.value.name,
      surname: component.registerAccountForm.value.surname,
      telephoneNumber: component.registerAccountForm.value.telephoneNumber,
      email: component.registerAccountForm.value.email,
      address: component.registerAccountForm.value.address,
      password: component.registerAccountForm.value.password
    }).and.returnValue(of({}))
    component.registerAccount()
    expect(authServiceSpy.addPassenger).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toEqual('')
  })

  it('should be passwords dont match', () => {
    component.registerAccountForm.controls.name.setValue('ime')
    component.registerAccountForm.controls.surname.setValue('ime')
    component.registerAccountForm.controls.telephoneNumber.setValue('ime')
    component.registerAccountForm.controls.email.setValue('ime@gmail.com')
    component.registerAccountForm.controls.address.setValue('ime')
    component.registerAccountForm.controls.password.setValue('ime')
    component.registerAccountForm.controls.confirmPassword.setValue('imee')
    expect(component.registerAccountForm.valid).toBeTruthy()
    component.registerAccount()
    expect(authServiceSpy.addPassenger).toHaveBeenCalledTimes(0)
    expect(component.errorMessage).toEqual('Passwords don\'t match')
  })

  it('should be passwords dont match', () => {
    component.registerAccountForm.controls.name.setValue('')
    component.registerAccountForm.controls.surname.setValue('')
    component.registerAccountForm.controls.telephoneNumber.setValue('')
    component.registerAccountForm.controls.email.setValue('')
    component.registerAccountForm.controls.address.setValue('')
    component.registerAccountForm.controls.password.setValue('ime')
    component.registerAccountForm.controls.confirmPassword.setValue('imee')
    expect(component.registerAccountForm.valid).toBeFalsy()
    component.registerAccount()
    expect(authServiceSpy.addPassenger).toHaveBeenCalledTimes(0)
    expect(component.errorMessage).toEqual('Passwords don\'t match')
  })

  it('should be invalid form because all empty', () => {
    component.registerAccountForm.controls.name.setValue('')
    component.registerAccountForm.controls.surname.setValue('')
    component.registerAccountForm.controls.telephoneNumber.setValue('')
    component.registerAccountForm.controls.email.setValue('')
    component.registerAccountForm.controls.address.setValue('')
    component.registerAccountForm.controls.password.setValue('')
    component.registerAccountForm.controls.confirmPassword.setValue('')
    expect(component.registerAccountForm.valid).toBeFalsy()
    authServiceSpy.addPassenger.withArgs({
      name: '',
      surname: '',
      telephoneNumber: '',
      email: '',
      address: '',
      password: ''
    }).and.returnValue(throwError(() => new HttpErrorResponse({ error: { message: 'Field {name} should not be empty' } })))
    component.registerAccount()
    expect(authServiceSpy.addPassenger).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toEqual('Field {name} should not be empty')
  })

  it('should be invalid form because email not valid', () => {
    component.registerAccountForm.controls.name.setValue('ime')
    component.registerAccountForm.controls.surname.setValue('ime')
    component.registerAccountForm.controls.telephoneNumber.setValue('ime')
    component.registerAccountForm.controls.email.setValue('ime')
    component.registerAccountForm.controls.address.setValue('ime')
    component.registerAccountForm.controls.password.setValue('ime')
    component.registerAccountForm.controls.confirmPassword.setValue('ime')
    expect(component.registerAccountForm.valid).toBeFalsy()
    authServiceSpy.addPassenger.withArgs({
      name: component.registerAccountForm.value.name,
      surname: component.registerAccountForm.value.surname,
      telephoneNumber: component.registerAccountForm.value.telephoneNumber,
      email: component.registerAccountForm.value.email,
      address: component.registerAccountForm.value.address,
      password: component.registerAccountForm.value.password
    }).and.returnValue(throwError(() => new HttpErrorResponse({ error: { message: 'Field {email} has wrong format' } })))
    component.registerAccount()
    expect(authServiceSpy.addPassenger).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toEqual('Field {email} has wrong format')
  })
})
