import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPerfilClient } from './header-perfil-client';

describe('HeaderPerfilClient', () => {
  let component: HeaderPerfilClient;
  let fixture: ComponentFixture<HeaderPerfilClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPerfilClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPerfilClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
