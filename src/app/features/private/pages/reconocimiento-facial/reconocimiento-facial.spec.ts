import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconocimientoFacial } from './reconocimiento-facial';

describe('ReconocimientoFacial', () => {
  let component: ReconocimientoFacial;
  let fixture: ComponentFixture<ReconocimientoFacial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconocimientoFacial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconocimientoFacial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
