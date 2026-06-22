import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteModal } from './corte-modal';

describe('CorteModal', () => {
  let component: CorteModal;
  let fixture: ComponentFixture<CorteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorteModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorteModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
