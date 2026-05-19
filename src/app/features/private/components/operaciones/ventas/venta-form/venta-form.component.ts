import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnInit
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

import { Venta } from '@/app/core/models/ventas/venta.model';

import { ClienteService } from '@/app/core/services/gestion/cliente.service';

import { Cliente } from '@/app/core/models/gestion/cliente/cliente.model';

import { ProductoService } from '@features/productos/services/producto-service';

import { ProductoResponse } from '@features/productos/models/response/ProductoResponse';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputNumberModule
  ],
  templateUrl: './venta-form.html'
})
export class VentaFormComponent implements OnInit {

  @Input() venta: Venta | null = null;

  @Output() guardar = new EventEmitter<any>();

  @Output() cancelarEvento =
    new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private clienteService = inject(ClienteService);

  private productoService = inject(ProductoService);

  clientes: Cliente[] = [];

  productos: ProductoResponse[] = [];

  ventaForm: FormGroup = this.fb.group({

    clienteId: [null, Validators.required],

    barberoId: [null, Validators.required],

    fecha: [new Date().toISOString()],

    detalles: this.fb.array([])

  });

  ngOnInit(): void {

    this.cargarClientes();

    this.cargarProductos();

    if (this.venta) {

      this.ventaForm.patchValue({

        clienteId: this.venta.clienteId,

        barberoId: this.venta.barberoId,

        fecha: this.venta.fecha

      });

      this.detalles.clear();

      this.venta.detalles?.forEach((detalle) => {

        this.detalles.push(

          this.fb.group({

            productoId: [
              detalle.productoId,
              Validators.required
            ],

            cantidad: [
              detalle.cantidad,
              Validators.required
            ],

            precioUnitario: [
              detalle.precioUnitario,
              Validators.required
            ]

          })

        );

      });

    }

    if (this.detalles.length === 0) {

      this.agregarDetalleVacio();

    }

  }

  cargarClientes(): void {

    this.clienteService.listar(0, 100)
      .subscribe({

        next: (resp) => {

          this.clientes = resp.data.content;

        }

      });

  }

  cargarProductos(): void {

    this.productoService.getProductos()
      .subscribe({

        next: (resp) => {

          this.productos = resp.data.content;

        }

      });

  }

  getNombreCliente(cliente: Cliente): string {

    return `${cliente.persona.nombre} ${cliente.persona.apellido}`;

  }

  get detalles(): FormArray {

    return this.ventaForm.get('detalles') as FormArray;

  }

  agregarDetalleVacio(): void {

    const detalle = this.fb.group({

      productoId: [null, Validators.required],

      cantidad: [1, Validators.required],

      precioUnitario: [0, Validators.required]

    });

    this.detalles.push(detalle);

  }

  eliminarDetalle(index: number): void {

    this.detalles.removeAt(index);

  }

  actualizarPrecio(index: number): void {

    const detalle = this.detalles.at(index);

    const productoId = detalle.get('productoId')?.value;

    const producto = this.productos.find(
      p => p.id === productoId
    );

    if (producto) {

      detalle.patchValue({

        precioUnitario: producto.precio

      });

    }

  }

  get total(): number {

    return this.detalles.controls.reduce((acc, item) => {

      const cantidad =
        item.get('cantidad')?.value || 0;

      const precio =
        item.get('precioUnitario')?.value || 0;

      return acc + (cantidad * precio);

    }, 0);

  }

  guardarVenta(): void {

    if (this.ventaForm.invalid) {

      this.ventaForm.markAllAsTouched();

      return;

    }

    this.guardar.emit(this.ventaForm.value);

  }

}