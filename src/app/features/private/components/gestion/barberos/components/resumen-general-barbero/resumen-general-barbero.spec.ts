import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenGeneralBarbero } from './resumen-general-barbero';

describe('ResumenGeneralBarbero', () => {
  let component: ResumenGeneralBarbero;
  let fixture: ComponentFixture<ResumenGeneralBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenGeneralBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenGeneralBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
