import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ReclamoService } from '@/app/core/services/operaciones/reclamo.service';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import { TipoReclamacion } from '@/app/core/models/operaciones/reclamos-model/reclamo.enum.model';
import { ReclamoPublicoRequest } from '@/app/core/models/operaciones/reclamos-model/reclamo.model';
import { TIPO_DOCUMENTO_OPTIONS, TIPO_PROBLEMA_OPTIONS, TIPO_RECLAMACION_OPTIONS } from '@/app/core/models/common/select.option.model';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  selector: 'app-reclamos',
  imports: [ReactiveFormsModule, SelectModule, InputTextModule, InputNumberModule, CheckboxModule,
    TextareaModule, ButtonModule, DatePickerModule, MessageModule, CommonModule
  ],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.css',
})
export class ReclamosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reclamoService = inject(ReclamoService);
  private notify = inject(NotificationService);

  form!: FormGroup;
  formSubmitted = false;
  enviando = false;
  enviado = false;
  numeroReclamo = '';
  archivos: File[] = [];
  today = new Date();

  tiposReclamacion = TIPO_RECLAMACION_OPTIONS;
  tiposDocumento = TIPO_DOCUMENTO_OPTIONS;
  tiposProblema = TIPO_PROBLEMA_OPTIONS;

  campoInvalido = (campo: string) => campoInvalido(this.form, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
    this.configurarValidacionDocumento();
  }

  private initForm(): void {
    this.form = this.fb.group({
      tipoReclamacion: [TipoReclamacion.RECLAMO, Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      tipoProblema: [null, Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      montoReclamado: [null],
      fechaOcurrencia: [null, Validators.required],
      aceptaVeracidad: [false, Validators.requiredTrue],
      aceptaDatos: [false, Validators.requiredTrue],
      aceptaTerminos: [false, Validators.requiredTrue],
    });
  }

  private configurarValidacionDocumento(): void {
    const tipoDocumentoControl = this.form.get('tipoDocumento');
    const numeroDocumentoControl = this.form.get('numeroDocumento');
    tipoDocumentoControl?.valueChanges.subscribe(tipo => {
      numeroDocumentoControl?.setValue('');
      switch (tipo) {
        case 'DNI': numeroDocumentoControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
          break;
        case 'CE': numeroDocumentoControl?.setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
          break;
        case 'PASAPORTE': numeroDocumentoControl?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,12}$/)]);
          break;
      }
      numeroDocumentoControl?.updateValueAndValidity();
    });
  }

  get maxLengthDocumento(): number {
    const tipo = this.form.get('tipoDocumento')?.value;
    switch (tipo) {
      case 'DNI':return 8;
      case 'CE':return 9;
      case 'PASAPORTE':return 12;
      default:return 12;
    }
  }

  onSeleccionarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const nuevos = Array.from(input.files);
    const validos = nuevos.filter(f => ['image/jpeg', 'image/png', 'application/pdf'].includes(f.type) && f.size <= 10 * 1024 * 1024);
    this.archivos = [...this.archivos, ...validos].slice(0, 5);
    input.value = '';
  }

  eliminarArchivo(index: number): void {
    this.archivos.splice(index, 1);
  }

  onLimpiar(): void {
    this.formSubmitted = false;
    this.archivos = [];
    this.form.reset({
      tipoReclamacion: TipoReclamacion.RECLAMO,
      tipoDocumento: 'DNI',
      aceptaVeracidad: false,
      aceptaDatos: false,
      aceptaTerminos: false,
    });
  }

  onEnviar(): void {
    this.formSubmitted = true;
    if (this.form.invalid) { marcarFormulario(this.form); return; }

    const v = this.form.value;
    const request: ReclamoPublicoRequest = {
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      email: v.email,
      telefono: v.telefono || undefined,
      tipoDocumento: v.tipoDocumento,
      numeroDocumento: v.numeroDocumento,
      tipoReclamacion: v.tipoReclamacion,
      tipoProblema: v.tipoProblema,
      descripcion: v.descripcion,
      montoReclamado: v.montoReclamado || undefined,
      fechaOcurrencia: v.fechaOcurrencia ? new Date(v.fechaOcurrencia).toISOString() : undefined,
    };

    this.enviando = true;
    this.reclamoService.crearReclamoPublico(request, this.archivos.length ? this.archivos : undefined)
      .subscribe({
        next: (res) => {
          this.enviando = false;
          this.enviado = true;
          this.numeroReclamo = res.data.numeroReclamo;
          this.notify.showSuccess(res.message);
          this.onLimpiar();
        },
        error: (error) => {
          this.enviando = false;
          this.notify.showHttpError(error.message);
        }
      });
  }

  formatearTamano(bytes: number): string {
    return bytes < 1024 * 1024 ? ` ${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  seleccionarTipo(tipo: string): void {
    this.form.get('tipoReclamacion')?.setValue(tipo as TipoReclamacion);
  }

  pasos = [
    { numero: '01', titulo: 'Registro', activo: false, icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', descripcion: 'Tu solicitud queda registrada y recibes un código de seguimiento en tu correo electrónico de forma inmediata.' },
    { numero: '02', titulo: 'Revisión', activo: false, icono: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', descripcion: 'Nuestro equipo analiza tu caso en un plazo máximo de 24 horas hábiles para evaluar la situación.' },
    { numero: '03', titulo: 'Contacto', activo: false, icono: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', descripcion: 'Nos comunicamos contigo por correo o teléfono para informarte el avance y coordinar la solución.' },
    { numero: '04', titulo: 'Resolución', activo: true, icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', descripcion: 'Emitimos una respuesta formal con la solución adoptada en un plazo máximo de 30 días calendario.' },
  ];

  canales = [
    { titulo: 'Teléfono', descripcion: 'Llámanos directamente y un representante tomará tu caso.', contacto: '+51 987 654 321', horario: 'Lun–Sáb · 9:00 am – 7:00 pm', icono: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { titulo: 'Correo', descripcion: 'Escríbenos y te respondemos en un máximo de 48 horas hábiles.', contacto: 'reclamos@barberia.pe', horario: 'Respuesta en 24–48 h', icono: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { titulo: 'Presencial', descripcion: 'Visítanos y solicita el libro físico de reclamaciones en caja.', contacto: 'Av. Principal 456', horario: 'Lun–Sáb · 9:00 am – 8:00 pm', icono: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  ];
}