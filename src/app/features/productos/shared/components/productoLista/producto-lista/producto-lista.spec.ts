import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoLista } from './producto-lista';

describe('ProductoLista', () => {
  let component: ProductoLista;
  let fixture: ComponentFixture<ProductoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
