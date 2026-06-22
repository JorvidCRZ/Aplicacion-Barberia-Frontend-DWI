import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberoHeader } from './barbero-header';

describe('BarberoHeader', () => {
  let component: BarberoHeader;
  let fixture: ComponentFixture<BarberoHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberoHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberoHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
