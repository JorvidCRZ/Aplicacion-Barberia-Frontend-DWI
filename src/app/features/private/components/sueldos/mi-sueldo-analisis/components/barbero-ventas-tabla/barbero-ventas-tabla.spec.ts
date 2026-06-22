import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberoVentasTabla } from './barbero-ventas-tabla';

describe('BarberoVentasTabla', () => {
  let component: BarberoVentasTabla;
  let fixture: ComponentFixture<BarberoVentasTabla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberoVentasTabla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberoVentasTabla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
