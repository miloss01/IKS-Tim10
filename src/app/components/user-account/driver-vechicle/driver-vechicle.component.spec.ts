import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVechicleComponent } from './driver-vechicle.component';

describe('DriverVechicleComponent', () => {
  let component: DriverVechicleComponent;
  let fixture: ComponentFixture<DriverVechicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverVechicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverVechicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
