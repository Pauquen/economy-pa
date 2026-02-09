import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpabotsComponent } from './rpabots.component';

describe('RpabotsComponent', () => {
  let component: RpabotsComponent;
  let fixture: ComponentFixture<RpabotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpabotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpabotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
