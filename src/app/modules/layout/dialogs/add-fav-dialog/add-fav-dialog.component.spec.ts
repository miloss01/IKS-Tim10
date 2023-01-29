import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFavDialogComponent } from './add-fav-dialog.component';

describe('AddFavDialogComponent', () => {
  let component: AddFavDialogComponent;
  let fixture: ComponentFixture<AddFavDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFavDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFavDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
