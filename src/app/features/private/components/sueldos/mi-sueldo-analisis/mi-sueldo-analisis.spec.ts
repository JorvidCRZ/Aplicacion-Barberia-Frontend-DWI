import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiSueldoAnalisis } from './mi-sueldo-analisis';

describe('MiSueldoAnalisis', () => {
  let component: MiSueldoAnalisis;
  let fixture: ComponentFixture<MiSueldoAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiSueldoAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiSueldoAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
