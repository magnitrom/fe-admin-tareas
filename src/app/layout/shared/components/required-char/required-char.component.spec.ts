import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredCharComponent } from './required-char.component';

describe('RequiredCharComponent', () => {
  let component: RequiredCharComponent;
  let fixture: ComponentFixture<RequiredCharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredCharComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequiredCharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
