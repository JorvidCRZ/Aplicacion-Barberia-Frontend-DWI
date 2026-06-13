import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { TreeNode } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputNumberModule } from 'primeng/inputnumber';

import { Servicio, ServicioRequest } from '@/app/core/models/catalogos/servicios.model';
import { Categoria } from '@/app/core/models/catalogos/categorias.model';
import { ImageUploadService } from '@/app/core/services/common/imageUpload.service';
import { ImagenProductoUI } from '@/app/core/models/common/imagen.model';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';

@Component({
  selector: 'app-servicio-form',
  imports: [
    ReactiveFormsModule, InputTextModule,CheckboxModule, TreeSelectModule, ButtonModule, 
    MessageModule, ImageModule, FileUploadModule, InputNumberModule, SafeImageUrlPipe
  ],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css',
})
export class ServicioFormComponent implements OnInit, OnChanges {

  @Output() guardar = new EventEmitter<{ data: ServicioRequest, imagenes?: File[] }>();
  @Output() cancelarEvento = new EventEmitter<void>();

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  @Input() servicio: Servicio | null = null;
  @Input() categorias: Categoria[] = [];
  @Input() resetTrigger: number = 0;

  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private imageService = inject(ImageUploadService);

  servicioForm!: FormGroup;

  categoriaTree: TreeNode[] = [];
  imagenes: ImagenProductoUI[] = [];
  imagenesEliminadas: string[] = [];

  formSubmitted = false;

  campoInvalido = (campo: string) =>
    campoInvalido(this.servicioForm, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
    this.cargarCategoriasTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.servicioForm || Object.keys(this.servicioForm.controls).length === 0) return;

    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.limpiarFormulario();
    }

    if (changes['categorias'] || (changes['servicio'] && !changes['servicio'].firstChange && !this.servicio)) {
      this.cargarCategoriasTree();
    }

    if (changes['servicio']) {
      this.actualizarFormulario();
      if (this.servicio?.urlsMultimedia?.length) {
        this.cargarImagenExistente(this.servicio.urlsMultimedia);
      }
    }
  }

  private initForm(): void {
    this.servicioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      duracion: [0, [Validators.required, Validators.min(1)]],
      idCategoria: [null, Validators.required],
      estado: [true]
    });
  }

  // ========================
  // PATCH EDIT
  // ========================
  private actualizarFormulario(): void {
    this.imagenes = [];
    this.imagenesEliminadas = [];

    if (this.servicio) {
      this.servicioForm.patchValue({
        nombre: this.servicio.nombre,
        precio: this.servicio.precio,
        duracion: this.servicio.duracion,
        estado: this.servicio.estado
      });

      if (this.servicio.categoriaId) {
        // wait for tree to be ready
        setTimeout(() => {
          if (this.categoriaTree.length && this.servicio?.categoriaId) {
            const match = this.findTreeNodeById(this.categoriaTree, this.servicio!.categoriaId!);
            this.servicioForm.patchValue({ idCategoria: match || null });
            this.cd.detectChanges();
          }
        });
      }
    } else {
      this.resetFormularioBase();
    }

    this.servicioForm.markAsPristine();
    this.servicioForm.markAsUntouched();
  }

  // ========================
  // IMAGES EXISTENTES
  // ========================
  private cargarImagenExistente(urls: string[]) {
    const requests = urls.map(url => this.imageService.obtenerImagenProtegida(url));

    forkJoin(requests).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(blobs => {

        this.imagenes = [];

        blobs.forEach((blob, index) => {
          if (!blob) return;

          const file = new File([blob], `img-${index}.jpg`, { type: blob.type });

          this.imagenes.push({
            file,
            preview: URL.createObjectURL(file),
            nombre: 'Imagen actual',
            peso: this.imageService.obtenerReadableSize(file),
            tipo: 'existente',
            urlOriginal: urls[index]
          });
        });

        this.cd.detectChanges();
      });
  }

  // ========================
  // IMAGE STATE HELPERS
  // ========================
  private limpiarEstadoImagen(): void {
    this.imagenes.forEach(img => { if (img.preview) { URL.revokeObjectURL(img.preview); } });
    this.imagenes = [];
    this.imagenesEliminadas = [];
    this.fileUpload?.clear();
  }

  private resetFormularioBase(): void {
    this.servicioForm.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 0,
      idCategoria: null
    });
    this.limpiarEstadoImagen();
  }

  // ========================
  // UPLOAD
  // ========================
  onSeleccionarArchivo(event: any): void {
    const files: File[] = Array.from(event.files);

    const validas = this.imageService.imagenesValidas(files);

    validas.forEach(file => {
      this.imagenes.push({
        file,
        preview: URL.createObjectURL(file),
        nombre: file.name,
        peso: this.imageService.obtenerReadableSize(file),
        tipo: 'nueva'
      });
    });
  }

  eliminarImagen(index: number) {
    const img = this.imagenes[index];

    if (img.preview) URL.revokeObjectURL(img.preview);

    if (img.tipo === 'existente' && img.urlOriginal) {
      this.imagenesEliminadas.push(img.urlOriginal);
    }

    this.imagenes.splice(index, 1);
  }

  // ========================
  // TREE
  // ========================
  cargarCategoriasTree() {
    this.categoriaTree = this.construirTree(this.categorias ?? []);
    this.cd.detectChanges();
  }

  private construirTree(categorias: Categoria[]): TreeNode[] {
    if (!Array.isArray(categorias)) { return []; }
    return categorias.map(categoria => ({
      label: categoria.nombre, key: String(categoria.id), data: categoria.id,
      children: categoria.subcategorias?.length ? this.construirTree(categoria.subcategorias) : []
    }));
  }

  // ========================
  // SAVE
  // ========================
  onGuardar() {
    this.formSubmitted = true;

    if (this.servicioForm.invalid) {
      marcarFormulario(this.servicioForm);
      return;
    }

    const archivos = this.imagenes
      .filter(i => i.file)
      .map(i => i.file as File);

    const categoria = this.servicioForm.value.idCategoria;

    const data: ServicioRequest = {
      nombre: this.servicioForm.value.nombre,
      precio: this.servicioForm.value.precio,
      duracion: this.servicioForm.value.duracion,
      categoriaId: Number(categoria?.key)
    };

    this.guardar.emit({
      data,
      imagenes: archivos.length ? archivos : undefined
    });
  }

  // ========================
  // CANCEL
  // ========================
  onCancelar() {
    this.formSubmitted = false;
    this.limpiarFormulario();
    this.cancelarEvento.emit();
  }

  private limpiarFormulario() {
    this.formSubmitted = false;
    this.resetFormularioBase();
    this.servicioForm.markAsPristine();
    this.servicioForm.markAsUntouched();
  }

  // ========================
  // TREE UTIL
  // ========================
  private findTreeNodeById(nodes: TreeNode[], id: number): TreeNode | null {
    for (const node of nodes) {
      if (Number(node.key) === id) return node;
      if (node.children?.length) {
        const found = this.findTreeNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}