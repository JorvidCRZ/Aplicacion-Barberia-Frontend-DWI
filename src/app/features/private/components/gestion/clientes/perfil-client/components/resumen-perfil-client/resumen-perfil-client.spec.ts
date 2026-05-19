import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPerfilClient } from './resumen-perfil-client';

describe('ResumenPerfilClient', () => {
  let component: ResumenPerfilClient;
  let fixture: ComponentFixture<ResumenPerfilClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenPerfilClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenPerfilClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
