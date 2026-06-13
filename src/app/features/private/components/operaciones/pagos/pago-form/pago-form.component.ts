import { Component, OnInit, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { PagoService } from '../../../../../../core/services/pagos/pago.service';
import { NotificationService } from '../../../../../../core/services/common/notification.service';
import { PagoRequest, PagoResponse, TipoPago } from '../../../../../../core/models/pagos/pago.model';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, InputNumberModule,  ButtonModule],
  templateUrl: './pago-form.component.html'
})

export class PagoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pagoService = inject(PagoService);
  private readonly notificationService = inject(NotificationService);

  @Output() onGuardar = new EventEmitter<PagoResponse>();
  @Output() onCerrar = new EventEmitter<void>();

  pagoForm!: FormGroup;
  loadingSubmit = signal<boolean>(false);
  reservasDisponibles = signal<any[]>([]);
  reservaSeleccionada = signal<any | null>(null);

  metodosOpciones = [{ label: 'Efectivo', value: 'EFECTIVO' }, { label: 'Yape', value: 'YAPE' }, { label: 'Plin', value: 'PLIN' }, { label: 'Tarjeta', value: 'TARJETA' }, { label: 'Transferencia', value: 'TRANSFERENCIA' }];
  tiposOpciones = [{ label: 'Reserva', value: 'RESERVA' }, { label: 'Venta', value: 'VENTA' }, { label: 'Servicio', value: 'SERVICIO' }, { label: 'Producto', value: 'PRODUCTO' }, { label: 'Mixto', value: 'MIXTO' }];

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      reservaId: [null, Validators.required],
      clienteId: [null, Validators.required], 
      barberoId: [null, Validators.required], 
      metodo: ['EFECTIVO', Validators.required],
      tipo: ['RESERVA', Validators.required],
      monto: [{ value: 0, disabled: false }, [Validators.required, Validators.min(0.00)]]
    });
    this.cargarReservasPendientes();
  }

  cargarReservasPendientes(): void {
    this.pagoService.getReservasPendientesPago().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.reservasDisponibles.set(res.data.map(r => ({ label: `Ref #${r.id} - ${r.clienteNombre} ${r.clienteApellido}`, value: r.id, raw: r })));
        }
      }
    });
  }

  onReservaChange(event: any): void {
    const selectedOpt = this.reservasDisponibles().find(r => r.value === event.value);
    if (selectedOpt) {
      this.reservaSeleccionada.set(selectedOpt.raw);
      this.pagoForm.patchValue({
        clienteId: selectedOpt.raw.clienteId,
        barberoId: selectedOpt.raw.barberoId,
        monto: selectedOpt.raw.montoTotal
      });
    } else {
      this.reservaSeleccionada.set(null);
      this.pagoForm.patchValue({ clienteId: null, barberoId: null, monto: 0 });
    }
  }

  registrarPago(): void {
    if (this.pagoForm.invalid) { this.pagoForm.markAllAsTouched(); return; }
    this.loadingSubmit.set(true);
    
    const requestPayload: PagoRequest = this.pagoForm.getRawValue();

    this.pagoService.crearPago(requestPayload).subscribe({
      next: (res) => {
        if (res.success && res.data) this.onGuardar.emit(res.data);
        else this.notificationService.showError(res.message || 'Error en la transacción.');
        this.loadingSubmit.set(false);
      },
      error: () => { 
        this.notificationService.showError('Error en el servidor al registrar.'); 
        this.loadingSubmit.set(false); 
      }
    });
  }

  cancelar(): void { this.onCerrar.emit(); }
}