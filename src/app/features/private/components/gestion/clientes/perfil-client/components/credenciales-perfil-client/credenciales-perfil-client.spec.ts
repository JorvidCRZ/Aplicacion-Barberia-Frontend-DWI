import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialesPerfilClient } from './credenciales-perfil-client';

describe('CredencialesPerfilClient', () => {
  let component: CredencialesPerfilClient;
  let fixture: ComponentFixture<CredencialesPerfilClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesPerfilClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialesPerfilClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
