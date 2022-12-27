import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChangeRequestComponent } from './manage-change-request.component';

describe('ManageChangeRequestComponent', () => {
  let component: ManageChangeRequestComponent;
  let fixture: ComponentFixture<ManageChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageChangeRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
