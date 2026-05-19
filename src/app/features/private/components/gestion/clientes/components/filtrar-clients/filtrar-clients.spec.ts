import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrarClients } from './filtrar-clients';

describe('FiltrarClients', () => {
  let component: FiltrarClients;
  let fixture: ComponentFixture<FiltrarClients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrarClients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrarClients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
