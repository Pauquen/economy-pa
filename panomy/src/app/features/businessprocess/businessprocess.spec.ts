import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessprocessComponent } from './businessprocess.component';

describe('BusinessprocessComponent', () => {
  let component: BusinessprocessComponent;
  let fixture: ComponentFixture<BusinessprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessprocessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
