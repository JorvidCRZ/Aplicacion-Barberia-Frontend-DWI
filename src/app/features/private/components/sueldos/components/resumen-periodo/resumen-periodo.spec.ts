import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPeriodo } from './resumen-periodo';

describe('ResumenPeriodo', () => {
  let component: ResumenPeriodo;
  let fixture: ComponentFixture<ResumenPeriodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenPeriodo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenPeriodo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
