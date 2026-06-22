import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberoKpis } from './barbero-kpis';

describe('BarberoKpis', () => {
  let component: BarberoKpis;
  let fixture: ComponentFixture<BarberoKpis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberoKpis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberoKpis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
