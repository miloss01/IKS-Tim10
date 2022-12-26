import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAccountDetailsComponent } from './driver-account-details.component';

describe('DriverAccountDetailsComponent', () => {
  let component: DriverAccountDetailsComponent;
  let fixture: ComponentFixture<DriverAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverAccountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
