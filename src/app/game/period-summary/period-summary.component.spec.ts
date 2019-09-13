import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodSummaryComponent } from './period-summary.component';

describe('PeriodSummaryComponent', () => {
  let component: PeriodSummaryComponent;
  let fixture: ComponentFixture<PeriodSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
