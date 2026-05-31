import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from "primeng/select";
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Categoria, CategoriaTipo } from '@/app/core/models/catalogos/categorias.model';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, InputTextModule, SelectModule, TextareaModule,
    CheckboxModule, ButtonModule, MessageModule, FileUploadModule
  ],
  templateUrl: './categoria-form.html'
})
export class CategoriaFormComponent implements OnChanges, OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Output() guardar = new EventEmitter<Categoria>();
  @Output() cancelarEvento = new EventEmitter<void>();
  @Input() categoria: Categoria | null = null;
  @Input() categoriasPadres: Categoria[] = [];

  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);

  formSubmitted = false;
  categoriaForm!: FormGroup;
  rutaPadreSeleccionado: Categoria[] = [];
  categoriasPadresFormateadas: Categoria[] = [];
  tiposCategoria = Object.values(CategoriaTipo).map(tipo => ({label: tipo.charAt(0) + tipo.slice(1).toLowerCase(),value: tipo}));

  campoInvalido = (campo: string) => campoInvalido(this.categoriaForm, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
    this.formatearCategorias();
    this.cambiosPadre();
  }

  ngOnChanges(): void {
    if (!this.categoriaForm) return;
    this.formatearCategorias();
    this.actualizarFormulario();
  }

  private initForm(): void {
    this.categoriaForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      descripcion: ['', Validators.maxLength(255)],
      estado: [false],
      padreId: [null],
      tipo: ['', Validators.required],
    });
  }

  private actualizarFormulario(): void {
    if (this.categoria) {
      this.categoriaForm.patchValue(this.categoria);
      this.construirRutaPadre(this.categoria.padreId ?? null);
    } else {
      this.resetFormularioBase();
    }
    this.categoriaForm.markAsPristine();
    this.categoriaForm.markAsUntouched();
  }

  onCancelar(): void {
    this.limpiarFormulario();
    this.cancelarEvento.emit();
  }

  onGuardar(): void {
    if (this.categoriaForm.invalid) {
      marcarFormulario(this.categoriaForm);
      return;
    }
    this.guardar.emit(this.categoriaForm.value);
  }

  private construirRutaPadre(padreId: number | null): void {
    if (!padreId) {
      this.rutaPadreSeleccionado = [];
      return;
    }
    const mapa = new Map<number, Categoria>();
    this.categoriasPadres.forEach(categoria => mapa.set(categoria.id, categoria)
    );
    const ruta: Categoria[] = [];
    let actual = mapa.get(padreId);
    while (actual) {
      ruta.unshift(actual);
      actual = actual.padreId ? mapa.get(actual.padreId) : undefined;
    }
    if (this.categoria) { ruta.push(this.categoria); }
    this.rutaPadreSeleccionado = ruta;
  }

  private formatearCategorias(): void {
    const todas = this.reducirCategorias(this.categoriasPadres);
    if (!this.categoria) {
      this.categoriasPadresFormateadas = todas.filter(categoria => categoria.padreId === null);
      return;
    }
    const padreId = this.categoria.padreId ?? null;
    this.categoriasPadresFormateadas = todas
      .filter(categoria => categoria.id !== this.categoria!.id && categoria.padreId === padreId)
      .map(categoria => ({ ...categoria, nombre: `— ${categoria.nombre}` }));
    if (padreId !== null) {
      const padre = todas.find(categoria => categoria.id === padreId);
      if (padre) {
        this.categoriasPadresFormateadas.unshift({ ...padre, nombre: padre.nombre });
      }
    }
  }

  private reducirCategorias(categorias: Categoria[]): Categoria[] {
    let resultado: Categoria[] = [];
    for (const categoria of categorias) {
      resultado.push(categoria);
      if (categoria.subcategorias?.length) {
        resultado = resultado.concat(this.reducirCategorias(categoria.subcategorias));
      }
    }
    return resultado;
  }

  cambiosPadre(): void {
    this.categoriaForm.get('padreId')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((padreId) => { this.construirRutaPadre(padreId); });
  }

  private limpiarFormulario(): void {
    this.resetFormularioBase();
    this.categoriaForm.markAsPristine();
    this.categoriaForm.markAsUntouched();
  }

  private resetFormularioBase(): void {
    this.categoriaForm.reset({
      nombre: '',
      estado: false,
      padreId: null,
      tipo: '',
      descripcion: '',
      mostrarEnMenu: false,
    });
    this.rutaPadreSeleccionado = [];
  }
}