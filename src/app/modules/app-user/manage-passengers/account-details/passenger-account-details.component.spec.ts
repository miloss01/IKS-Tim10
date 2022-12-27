import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerAccountDetailsComponent } from './passenger-account-details.component';

describe('PassengerAccountDetailsComponent', () => {
  let component: PassengerAccountDetailsComponent;
  let fixture: ComponentFixture<PassengerAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerAccountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
