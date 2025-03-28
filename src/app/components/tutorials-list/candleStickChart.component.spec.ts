import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandleStickChartComponent } from './candleStickChart.component';

describe('CandleStickChartComponent', () => {
  let component: CandleStickChartComponent;
  let fixture: ComponentFixture<CandleStickChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandleStickChartComponent]
    });
    fixture = TestBed.createComponent(CandleStickChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
