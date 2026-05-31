import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPerfilBarbero } from './resumen-perfil-barbero';

describe('ResumenPerfilBarbero', () => {
  let component: ResumenPerfilBarbero;
  let fixture: ComponentFixture<ResumenPerfilBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenPerfilBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenPerfilBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
