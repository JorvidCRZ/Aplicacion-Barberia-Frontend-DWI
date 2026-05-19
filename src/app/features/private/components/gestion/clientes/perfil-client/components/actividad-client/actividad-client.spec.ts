import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadClient } from './actividad-client';

describe('ActividadClient', () => {
  let component: ActividadClient;
  let fixture: ComponentFixture<ActividadClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
