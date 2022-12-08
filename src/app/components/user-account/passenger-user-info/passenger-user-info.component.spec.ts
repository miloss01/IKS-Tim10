import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerUserInfoComponent } from './passenger-user-info.component';

describe('PassengerUserInfoComponent', () => {
  let component: PassengerUserInfoComponent;
  let fixture: ComponentFixture<PassengerUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerUserInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
