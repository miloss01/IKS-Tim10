import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerOtherAccInfoComponent } from './passenger-other-acc-info.component';

describe('PassengerOtherAccInfoComponent', () => {
  let component: PassengerOtherAccInfoComponent;
  let fixture: ComponentFixture<PassengerOtherAccInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerOtherAccInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerOtherAccInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
