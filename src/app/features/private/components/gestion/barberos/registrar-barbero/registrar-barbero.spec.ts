import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarBarbero } from './registrar-barbero';

describe('RegistrarBarbero', () => {
  let component: RegistrarBarbero;
  let fixture: ComponentFixture<RegistrarBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
