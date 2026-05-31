import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialesPerfilBarbero } from './credenciales-perfil-barbero';

describe('CredencialesPerfilBarbero', () => {
  let component: CredencialesPerfilBarbero;
  let fixture: ComponentFixture<CredencialesPerfilBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesPerfilBarbero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialesPerfilBarbero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
