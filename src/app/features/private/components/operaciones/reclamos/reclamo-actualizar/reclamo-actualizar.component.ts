import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ReclamoResponse, ReclamoSolucionRequest } from '@/app/core/models/operaciones/reclamos-model/reclamo.model';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import {
  ESTADO_RECLAMO_OPTIONS,
  SOLUCION_RECLAMO_OPTIONS,
} from '@/app/core/models/common/select.option.model';
import { SolesPipe } from '@/app/shared/pipes/moneda.pipe';

@Component({
  selector: 'app-reclamo-actualizar',
  imports: [
    ReactiveFormsModule, InputTextModule, SelectModule, TextareaModule,
    ButtonModule, MessageModule, InputNumberModule,SolesPipe
  ],
  templateUrl: './reclamo-actualizar.html',
  styleUrl: './reclamo-actualizar.css',
})
export class ReclamoActualizarComponent implements OnInit, OnChanges {
  @Output() guardar        = new EventEmitter<ReclamoSolucionRequest>();
  @Output() cancelarEvento = new EventEmitter<void>();
  @Input() reclamo: ReclamoResponse | null = null;

  private fb = inject(FormBuilder);

  formSubmitted = false;
  actualizarForm!: FormGroup;

  readonly estadoOpts   = ESTADO_RECLAMO_OPTIONS;
  readonly solucionOpts = SOLUCION_RECLAMO_OPTIONS;

  campoInvalido = (campo: string) => campoInvalido(this.actualizarForm, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reclamo'] && this.actualizarForm) {
      this.cargarDatos();
    }
  }

  private initForm(): void {
    this.actualizarForm = this.fb.group({
      estadoReclamo:   [null, Validators.required],
      solucionReclamo: [null],
      notasInternas:   [''],
      montoCompensado: [null, Validators.min(0)],
    });
  }

  private cargarDatos(): void {
    if (!this.reclamo) return;
    this.actualizarForm.patchValue({
      estadoReclamo:   this.reclamo.estadoReclamo   ?? null,
      solucionReclamo: this.reclamo.solucionReclamo ?? null,
      notasInternas:   this.reclamo.notasInternas   ?? '',
      montoCompensado: this.reclamo.montoCompensado ?? null,
    });
    this.actualizarForm.markAsPristine();
    this.actualizarForm.markAsUntouched();
    this.formSubmitted = false;
  }

  onGuardar(): void {
    this.formSubmitted = true;
    if (this.actualizarForm.invalid) { marcarFormulario(this.actualizarForm); return; }

    const v = this.actualizarForm.value;
    const request: ReclamoSolucionRequest = {
      estadoReclamo:   v.estadoReclamo,
      solucionReclamo: v.solucionReclamo ?? undefined,
      notasInternas:   v.notasInternas   || undefined,
      montoCompensado: v.montoCompensado ?? undefined,
    };
    this.guardar.emit(request);
  }

  onCancelar(): void {
    this.formSubmitted = false;
    this.cargarDatos();
    this.cancelarEvento.emit();
  }
}