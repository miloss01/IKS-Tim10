import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDocumentsComponent } from './driver-documents.component';

describe('DriverDocumentsComponent', () => {
  let component: DriverDocumentsComponent;
  let fixture: ComponentFixture<DriverDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
