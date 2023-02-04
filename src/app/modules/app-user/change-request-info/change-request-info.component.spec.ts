import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestInfoComponent } from './change-request-info.component';

describe('ChangeRequestInfoComponent', () => {
  let component: ChangeRequestInfoComponent;
  let fixture: ComponentFixture<ChangeRequestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
