import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilClient } from './perfil-client';

describe('PerfilClient', () => {
  let component: PerfilClient;
  let fixture: ComponentFixture<PerfilClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
