import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrarBarbero } from './filtrar-barbero';

describe('FiltrarBarbero', () => {
  let component: FiltrarBarbero;
  let fixture: ComponentFixture<FiltrarBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrarBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrarBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
