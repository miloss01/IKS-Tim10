import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { LoginAuthentificationService } from './login-authentification.service';

describe('LoginAuthentificationService', () => {
  let service: LoginAuthentificationService
  let httpController: HttpTestingController
  
  let url = environment.apiHost

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: JwtHelperService, useValue: {}}
      ]
    });
    service = TestBed.inject(LoginAuthentificationService)
    httpController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpController.verify()
    localStorage.removeItem('user')
  });

  it('should be created', () => {
    expect(service).toBeTruthy()
  });

  it('should login user', () => {

    service.login({email: "nana@DEsi.com", password: "333"}).subscribe((res) => {
      expect(res).toEqual({accessToken: "nana token", refreshToken: "nema"})
    })

    let req = httpController.expectOne({
      method: "POST",
      url: url + "user/login"
    })

    req.flush({accessToken: "nana token", refreshToken: "nema"})

  })

  it('should change active flag of user', () => {

    spyOn(service, 'getId').and.returnValue(1)

    service.changeActiveFlag(true).subscribe((res) => {
      expect(res).toEqual({active: true})
    })

    let req = httpController.expectOne({
      method: "PUT",
      url: url + "user/changeActiveFlag/" + service.getId()
    })

    req.flush({active: true})

  })

  it('should get active flag of user', () => {

    spyOn(service, 'getId').and.returnValue(1)

    service.getActiveFlag().subscribe((res) => {
      expect(res).toEqual({active: true})
    })

    let req = httpController.expectOne({
      method: "GET",
      url: url + "user/activeFlag/" + service.getId()
    })

    req.flush({active: true})

  })

  it('should start working hour', () => {

    spyOn(service, 'getId').and.returnValue(1)
    let date = new Date()

    service.addWorkingHour().subscribe((res) => {
      expect(res).toEqual({start: date})
    })

    let req = httpController.expectOne({
      method: "POST",
      url: url + "driver/" + service.getId() + "/working-hour"
    })

    req.flush({start: date})

  })

  it('should end working hour', () => {

    spyOn(service, 'getId').and.returnValue(1)
    let date = new Date()

    service.endWorkingHour().subscribe((res) => {
      expect(res).toEqual({end: date})
    })

    let req = httpController.expectOne({
      method: "POST",
      url: url + "driver/" + service.getId() + "/working-hour"
    })

    req.flush({end: date})

  })

  it('should check if user is logged in', () => {

    localStorage.setItem('user', "token")
    expect(service.isLoggedIn()).toBe(true)

  })

  it('should check if user is logged out', () => {

    expect(service.isLoggedIn()).toBe(false)

  })

  it('should logout user', () => {

    service.logout()
    expect(localStorage.getItem('user')).toBe(null)
    expect(service.user$.getValue()).toEqual({})

  })

  it('should set user', () => {

    spyOn(service, 'getId').and.returnValue(1)
    spyOn(service, 'getRole').and.returnValue("PASSENGER")
    spyOn(service, 'getEmail').and.returnValue("nana@DEsi.com")

    service.setUser()

    expect(service.user$.getValue()).toEqual({id: 1, role: "PASSENGER", email: "nana@DEsi.com"})

  })

  it('should get role of user', () => {

    localStorage.setItem('user', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuYW5hQERFc2kuY29tIiwicm9sZSI6IlBBU1NFTkdFUiIsImlkIjoxfQ.MX9Ac7BiD7dKKEcCcEz7bjwRTVicG_ONo-DUg9ZFSoQ")
    expect(service.getRole()).toBe("PASSENGER")

  })

  it('should get id of user', () => {

    localStorage.setItem('user', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuYW5hQERFc2kuY29tIiwicm9sZSI6IlBBU1NFTkdFUiIsImlkIjoxfQ.MX9Ac7BiD7dKKEcCcEz7bjwRTVicG_ONo-DUg9ZFSoQ")
    expect(service.getId()).toBe(1)

  })

  it('should get email of user', () => {

    localStorage.setItem('user', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuYW5hQERFc2kuY29tIiwicm9sZSI6IlBBU1NFTkdFUiIsImlkIjoxfQ.MX9Ac7BiD7dKKEcCcEz7bjwRTVicG_ONo-DUg9ZFSoQ")
    expect(service.getEmail()).toBe("nana@DEsi.com")

  })

});
