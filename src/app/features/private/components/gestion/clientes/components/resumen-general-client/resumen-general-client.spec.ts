import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenGeneralClient } from './resumen-general-client';

describe('ResumenGeneralClient', () => {
  let component: ResumenGeneralClient;
  let fixture: ComponentFixture<ResumenGeneralClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenGeneralClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenGeneralClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
