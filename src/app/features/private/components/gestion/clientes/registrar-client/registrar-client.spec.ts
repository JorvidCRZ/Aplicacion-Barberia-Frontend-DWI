import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarClient } from './registrar-client';

describe('RegistrarClient', () => {
  let component: RegistrarClient;
  let fixture: ComponentFixture<RegistrarClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
