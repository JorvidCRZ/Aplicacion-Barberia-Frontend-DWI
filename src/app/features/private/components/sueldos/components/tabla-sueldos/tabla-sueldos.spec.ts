import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSueldos } from './tabla-sueldos';

describe('TablaSueldos', () => {
  let component: TablaSueldos;
  let fixture: ComponentFixture<TablaSueldos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaSueldos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaSueldos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
