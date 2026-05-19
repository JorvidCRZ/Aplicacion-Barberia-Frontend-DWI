import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoDetalle } from './producto-detalle';

describe('ProductoDetalle', () => {
  let component: ProductoDetalle;
  let fixture: ComponentFixture<ProductoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
