import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverUserInfoComponent } from './driver-user-info.component';

describe('DriverUserInfoComponent', () => {
  let component: DriverUserInfoComponent;
  let fixture: ComponentFixture<DriverUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverUserInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
