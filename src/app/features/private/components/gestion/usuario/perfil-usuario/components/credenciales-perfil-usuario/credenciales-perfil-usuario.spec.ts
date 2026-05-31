import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialesPerfilUsuario } from './credenciales-perfil-usuario';

describe('CredencialesPerfilUsuario', () => {
  let component: CredencialesPerfilUsuario;
  let fixture: ComponentFixture<CredencialesPerfilUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesPerfilUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialesPerfilUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
