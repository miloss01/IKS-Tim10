import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { DriverDTO, VehicleDTO } from 'src/app/models/models';
import { AppUserService } from 'src/app/services/app-user.service';

import { RegisterDriverComponent } from './register-driver.component';

describe('RegisterDriverComponent', () => {
  let component: RegisterDriverComponent;
  let fixture: ComponentFixture<RegisterDriverComponent>;

  let injector: TestBed;
  let snackBar: MatSnackBar;

  let appUserServiceSpy: jasmine.SpyObj<AppUserService>
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>


  beforeEach(async () => {

    appUserServiceSpy = jasmine.createSpyObj<AppUserService>(['addDriver', 'setDriverVehicle'])

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, HttpClientTestingModule, MaterialModule, BrowserAnimationsModule, MatSelectModule, ReactiveFormsModule],
      declarations: [ RegisterDriverComponent ],
      providers: [
        {provide: AppUserService, useValue: appUserServiceSpy},
        {provide: MatSnackBar, useValue: snackBar},
        MatSnackBar 
      ]
    })
    .compileComponents();

    injector = getTestBed();
    snackBar = injector.inject(MatSnackBar);

    fixture = TestBed.createComponent(RegisterDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register driver', () => {
    let driver: DriverDTO = {
      id: null,
      name: "TestName",
      surname: "TestSurname",
      telephoneNumber: "0604321",
      email: "test@email.com",
      address: "TestAddress",
      profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
      password: "333"
    }
    let returnedDriver: DriverDTO = {
      id: 100,
      name: "TestName",
      surname: "TestSurname",
      telephoneNumber: "0604321",
      email: "test@email.com",
      address: "TestAddress",
      profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
      password: "333"
    }
    appUserServiceSpy.addDriver.withArgs(driver).and.returnValue(of(returnedDriver))
    component.registerDriverForm.patchValue({
      name: driver.name,
      lastName: driver.surname,
      phone: driver.telephoneNumber,
      address: driver.address,
      email: driver.email,
      password: driver.password
    })

    component.registerDriver()
    expect(appUserServiceSpy.addDriver).toHaveBeenCalledTimes(1)
  });

  it('should not register driver because email already exists', () => {
    let driver: DriverDTO = {
      id: null,
      name: "TestName",
      surname: "TestSurname",
      telephoneNumber: "0604321",
      email: "test@email.com",
      address: "TestAddress",
      profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
      password: "333"
    }

    appUserServiceSpy.addDriver.withArgs(driver).and.returnValue(throwError(() => new HttpErrorResponse({error: {message: "User with that email already exists!"}})))
    component.registerDriverForm.patchValue({
      name: driver.name,
      lastName: driver.surname,
      phone: driver.telephoneNumber,
      address: driver.address,
      email: driver.email,
      password: driver.password
    })

    component.registerDriver()
    expect(appUserServiceSpy.addDriver).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toBe("User with that email already exists!")

  });

  it('should register vehicle', () => {
    let vehicle: VehicleDTO = {
      id: null,
      driverId: null,
      vehicleType: "STANDARD",
      model: "citroen5e",
      licenseNumber: "ns12-pv",
      currentLocation: {
        address: 'Strazilovska 20, novi sad',
        latitude: 45.2501342,
        longitude: 19.8480507
      },
      passengerSeats: 5,
      babyTransport: true,
      petTransport: true
    }
    appUserServiceSpy.setDriverVehicle.withArgs(100, vehicle).and.returnValue(of("ok"))
    expect(appUserServiceSpy.setDriverVehicle).toHaveBeenCalledTimes(0)

    component.registerDriverForm.patchValue({
      model: vehicle.model,
      registrationPlate: vehicle.licenseNumber,
      seats: vehicle.passengerSeats,
      pets: vehicle.petTransport,
      kids: vehicle.babyTransport
    })
    spyOn(snackBar, 'open');
    component.driverId = 100
    component.addVehicle()
    fixture.detectChanges();

    expect(appUserServiceSpy.setDriverVehicle).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toBe("")
    expect(snackBar.open).toHaveBeenCalled();
  })

  it('should not register vehicle because driver has not been registered', () => {
    let vehicle: VehicleDTO = {
      id: null,
      driverId: null,
      vehicleType: "STANDARD",
      model: "citroen5e",
      licenseNumber: "ns12-pv",
      currentLocation: {
        address: 'Strazilovska 20, novi sad',
        latitude: 45.2501342,
        longitude: 19.8480507
      },
      passengerSeats: 5,
      babyTransport: true,
      petTransport: true
    }
    appUserServiceSpy.setDriverVehicle.withArgs(100, vehicle).and.returnValue(of("not ok"))
    expect(appUserServiceSpy.setDriverVehicle).toHaveBeenCalledTimes(0)

    component.registerDriverForm.patchValue({
      model: vehicle.model,
      registrationPlate: vehicle.licenseNumber,
      seats: vehicle.passengerSeats,
      pets: vehicle.petTransport,
      kids: vehicle.babyTransport
    })
    component.driverId = 0
    component.addVehicle()
    fixture.detectChanges();
    
    expect(component.errorMessage).toBe("You must add driver before creating vehicle")
    expect(appUserServiceSpy.setDriverVehicle).toHaveBeenCalledTimes(0)
  })

  it(`form should be invalid`, () => {
    component.registerDriverForm.controls['email'].setValue('');
    component.registerDriverForm.controls['name'].setValue('');
    component.registerDriverForm.controls['lastName'].setValue('');
    component.registerDriverForm.controls['phone'].setValue('');
    component.registerDriverForm.controls['address'].setValue('');
    component.registerDriverForm.controls['password'].setValue('');
    component.registerDriverForm.controls['model'].setValue('');
    component.registerDriverForm.controls['registrationPlate'].setValue('');
    component.registerDriverForm.controls['seats'].setValue(null);

    expect(component.registerDriverForm.valid).toBeFalsy();
  });

  it(`form should be valid`, () => {
    component.registerDriverForm.controls['email'].setValue('sdf@gmail.com');
    component.registerDriverForm.controls['name'].setValue('sdf');
    component.registerDriverForm.controls['lastName'].setValue('asdf');
    component.registerDriverForm.controls['phone'].setValue('as');
    component.registerDriverForm.controls['address'].setValue('sdf');
    component.registerDriverForm.controls['password'].setValue('asdf');
    component.registerDriverForm.controls['model'].setValue('asdf');
    component.registerDriverForm.controls['registrationPlate'].setValue('asdf');
    component.registerDriverForm.controls['seats'].setValue(4);
    expect(component.registerDriverForm.valid).toBeTruthy();
  });

  it(`should not register driver because field name is empty`, () => {
    let driver: DriverDTO = {
      id: null,
      name: "",
      surname: "TestSurname",
      telephoneNumber: "0604321",
      email: "test@email.com",
      address: "TestAddress",
      profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
      password: "333"
    }
    appUserServiceSpy.addDriver.withArgs(driver).and.returnValue(
      throwError(() => new HttpErrorResponse({error: {message: "Field (name) cannot be empty"}})))
    component.registerDriverForm.patchValue({
      name: "",
      lastName: driver.surname,
      phone: driver.telephoneNumber,
      address: driver.address,
      email: driver.email,
      password: driver.password
    })

    component.registerDriver()

    expect(appUserServiceSpy.addDriver).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toBe("Field (name) cannot be empty")
    expect(component.registerDriverForm.valid).toBeFalsy();
  });

  it('should not register vehicle because registration plate field is empty', () => {
    let vehicle: VehicleDTO = {
      id: null,
      driverId: null,
      vehicleType: "STANDARD",
      model: "citroen5e",
      licenseNumber: "ns12-pv",
      currentLocation: {
        address: 'Strazilovska 20, novi sad',
        latitude: 45.2501342,
        longitude: 19.8480507
      },
      passengerSeats: 5,
      babyTransport: true,
      petTransport: true
    }
    appUserServiceSpy.setDriverVehicle.withArgs(100, vehicle).and.returnValue(throwError(() => new HttpErrorResponse({error: {message: "Field (licenseNumber) is required!"}})))

    component.registerDriverForm.patchValue({
      model: vehicle.model,
      registrationPlate: vehicle.licenseNumber,
      seats: vehicle.passengerSeats,
      pets: vehicle.petTransport,
      kids: vehicle.babyTransport
    })
    component.driverId = 100
    component.addVehicle()
    fixture.detectChanges();
    
    expect(appUserServiceSpy.setDriverVehicle).toHaveBeenCalledTimes(1)
    expect(component.errorMessage).toBe("Field (licenseNumber) is required!")
    expect(component.registerDriverForm.valid).toBeFalsy();
  })

});
