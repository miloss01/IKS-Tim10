import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon'
import { BasicUserInformationComponent } from './basic-user-information.component';

describe('BasicUserInformationComponent', () => {
  let component: BasicUserInformationComponent;
  let fixture: ComponentFixture<BasicUserInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicUserInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicUserInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
