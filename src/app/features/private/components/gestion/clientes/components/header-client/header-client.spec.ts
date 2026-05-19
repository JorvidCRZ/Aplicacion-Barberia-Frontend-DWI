import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderClient } from './header-client';

describe('HeaderClient', () => {
  let component: HeaderClient;
  let fixture: ComponentFixture<HeaderClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
