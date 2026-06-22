import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSueldos } from './grafico-sueldos';

describe('GraficoSueldos', () => {
  let component: GraficoSueldos;
  let fixture: ComponentFixture<GraficoSueldos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoSueldos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoSueldos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
