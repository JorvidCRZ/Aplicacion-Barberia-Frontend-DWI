import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionBasica } from './informacion-basica';

describe('InformacionBasica', () => {
  let component: InformacionBasica;
  let fixture: ComponentFixture<InformacionBasica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionBasica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionBasica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
