import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
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
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    TooltipModule,
    TagModule
  ],
  templateUrl: './venta-form.html'
})
export class VentaFormComponent implements OnInit, OnChanges {

  @Input() venta: any = null;
  @Input() isEditMode: boolean = false;

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelarEvento = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);

  clientes: any[] = [];
  productos: any[] = [];

  tiposComprobante = [
    { label: 'Boleta', value: 'BOLETA' },
    { label: 'Factura', value: 'FACTURA' }
  ];

  ventaForm: FormGroup = this.fb.group({
    clienteId: [null, Validators.required],
    tipoComprobante: ['BOLETA', Validators.required],
    detalles: this.fb.array([])
  });

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['venta'] && this.venta && this.isEditMode) {
      this.cargarVentaParaEditar();
    }

    if (changes['isEditMode'] && this.isEditMode) {
      this.bloquearTodoElFormulario();
    }

  }

  cargarDatosIniciales(): void {

    this.clienteService.listar(0, 100).subscribe({
      next: (resp) => {
        this.clientes = resp.data.content || [];
      },
      error: () => {
        this.clientes = [];
      }
    });

    this.productoService.obtenerProductos(0, 100).subscribe({
  next: (resp: any) => {
    this.productos = resp.data.content || [];
  },
  error: () => {
    this.productos = [];
  }
});

    if (!this.isEditMode) {
      this.detalles.clear();
      this.agregarDetalleVacio();
    }

  }

  cargarVentaParaEditar(): void {

    if (!this.venta) return;

    this.ventaForm.patchValue({
      clienteId: this.venta.clienteId,
      tipoComprobante: this.venta.tipoComprobante
    });

    this.detalles.clear();

    if (this.venta.detalles?.length > 0) {

      this.venta.detalles.forEach((detalle: any) => {

        const detalleForm = this.crearDetalleForm();

        detalleForm.patchValue({
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario
        });

        this.detalles.push(detalleForm);

      });

    } else {

      this.agregarDetalleVacio();

    }

    this.bloquearTodoElFormulario();

  }

  bloquearTodoElFormulario(): void {

    this.ventaForm.get('clienteId')?.disable();
    this.ventaForm.get('tipoComprobante')?.disable();

    this.detalles.controls.forEach(control => {
      control.get('productoId')?.disable();
      control.get('cantidad')?.disable();
      control.get('precioUnitario')?.disable();
    });

  }

  get detalles(): FormArray {
    return this.ventaForm.get('detalles') as FormArray;
  }

  get total(): number {

    return this.detalles.controls.reduce((acc, control) => {

      const cantidad = Number(control.get('cantidad')?.value || 0);
      const precio = Number(control.get('precioUnitario')?.value || 0);

      return acc + (cantidad * precio);

    }, 0);

  }

  get subtotalGeneral(): number {
    return this.total / 1.18;
  }

  get igv(): number {
    return this.total - this.subtotalGeneral;
  }

  get hayErroresDeStock(): boolean {

    return this.detalles.controls.some(control =>
      control.get('cantidad')?.hasError('stockInsuficiente')
    );

  }

  getNombreCliente(): string {

    const clienteId = this.ventaForm.getRawValue().clienteId;
    const cliente = this.clientes.find(c => c.clienteId === clienteId);

    if (!cliente) return '—';

    const { nombre = '', apellido = '' } = cliente.persona ?? {};

    return `${nombre} ${apellido}`.trim() || '—';

  }

  getLabelComprobante(): string {

    const value = this.ventaForm.getRawValue().tipoComprobante;
    const tipo = this.tiposComprobante.find(t => t.value === value);

    return tipo?.label ?? value ?? '—';

  }

  getNombreProducto(index: number): string {

    const productoId = this.detalles.at(index).get('productoId')?.value;
    const producto = this.productos.find(p => Number(p.id) === Number(productoId));

    return producto?.nombre ?? '—';

  }

  crearDetalleForm(): FormGroup {

    const detalleForm = this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(9999)
        ]
      ],
      precioUnitario: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ]
    });

    if (!this.isEditMode) {

      detalleForm.get('productoId')?.valueChanges.subscribe((productoId) => {

        const producto = this.productos.find(
          p => Number(p.id) === Number(productoId)
        );

        detalleForm.patchValue({
          precioUnitario: producto ? Number(producto.precio || 0) : 0
        }, { emitEvent: false });

        this.validarStockForm(detalleForm);

      });

      detalleForm.get('cantidad')?.valueChanges.subscribe((cantidad) => {

        let valor = Number(cantidad || 1);

        if (valor < 1) valor = 1;
        if (valor > 9999) valor = 9999;

        detalleForm.get('cantidad')?.setValue(valor, { emitEvent: false });

        this.validarStockForm(detalleForm);

      });

    }

    return detalleForm;

  }

  agregarDetalleVacio(): void {

    if (this.isEditMode) return; 

    const detalleForm = this.crearDetalleForm();
    this.detalles.push(detalleForm);

  }

  eliminarDetalle(index: number): void {

    if (this.isEditMode) return; 

    this.detalles.removeAt(index);

    if (this.detalles.length === 0) {
      this.agregarDetalleVacio();
    }

  }

  validarStock(index: number): void {

    if (this.isEditMode) return;

    const detalle = this.detalles.at(index) as FormGroup;
    this.validarStockForm(detalle);

  }

  validarStockForm(detalle: FormGroup): void {

    if (this.isEditMode) return;

    const productoId = detalle.get('productoId')?.value;
    const cantidad = Number(detalle.get('cantidad')?.value || 0);
    const producto = this.productos.find(p => Number(p.id) === Number(productoId));

    if (!producto) return;

    const stock = Number(producto.stock || 0);

    if (cantidad > stock) {

      detalle.get('cantidad')?.setErrors({ stockInsuficiente: true });

    } else {

      const errors = detalle.get('cantidad')?.errors;

      if (errors) {
        delete errors['stockInsuficiente'];
        detalle.get('cantidad')?.setErrors(
          Object.keys(errors).length === 0 ? null : errors
        );
      }

    }

  }

  getStock(index: number): number {

    const productoId = this.detalles.at(index).get('productoId')?.value;
    const producto = this.productos.find(p => Number(p.id) === Number(productoId));

    return producto ? Number(producto.stock) : 9999;

  }

  getSubtotalLinea(index: number): number {

    const detalle = this.detalles.at(index);
    const cantidad = Number(detalle.get('cantidad')?.value || 0);
    const precio = Number(detalle.get('precioUnitario')?.value || 0);

    return cantidad * precio;

  }

  actualizarPrecio(index: number): void {

    if (this.isEditMode) return;

    const detalle = this.detalles.at(index);
    const productoId = detalle.get('productoId')?.value;
    const producto = this.productos.find(p => Number(p.id) === Number(productoId));

    detalle.patchValue({
      precioUnitario: producto ? Number(producto.precio || 0) : 0
    }, { emitEvent: false });

    this.validarStock(index);

  }

  guardarVenta(): void {

    if (this.isEditMode) return; // Guardia final de seguridad

    if (this.ventaForm.invalid || this.hayErroresDeStock) {
      this.ventaForm.markAllAsTouched();
      return;
    }

    const formValue = this.ventaForm.getRawValue();

    const payload = {
      clienteId: formValue.clienteId,
      fecha: new Date(),
      tipoComprobante: formValue.tipoComprobante,
      detalles: formValue.detalles.map((detalle: any) => ({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario
      }))
    };

    this.guardar.emit(payload);

    this.ventaForm = this.fb.group({
      clienteId: [null, Validators.required],
      tipoComprobante: ['BOLETA', Validators.required],
      detalles: this.fb.array([])
    });

    this.agregarDetalleVacio();

  }

}