import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { driver, driverResponse, vehicle } from '../mocks/app-user.service.mock';

import { AppUserService } from './app-user.service';

describe('AppUserService', () => {
  let service: AppUserService
  let httpController: HttpTestingController
  
  let url = environment.apiHost


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AppUserService);
    httpController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add driver', () => {
    service.addDriver(driver).subscribe((data) => {
      expect(data).toEqual(driverResponse);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}driver`,
    });

    req.flush(driverResponse);
  });

  it('should set driver vehicle', () => {
    service.setDriverVehicle(100, vehicle).subscribe((data) => {
      expect(data).toEqual("OK");
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}driver/100/vehicle`,
    });

    req.flush("OK");
  });

});
