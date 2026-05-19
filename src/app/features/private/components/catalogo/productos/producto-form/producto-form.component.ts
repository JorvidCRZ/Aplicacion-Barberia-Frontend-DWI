import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from "primeng/select";
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Producto, ProductoRequest } from '@/app/core/models/catalogos/productos.model';
import { Categoria } from '@/app/core/models/catalogos/categorias.model';
import { ImageUploadService } from '@/app/core/services/common/imageUpload.service';
import { ImagenProductoUI } from '@/app/core/models/common/imagen.model';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';

@Component({
  selector: 'app-producto-form',
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, CheckboxModule, TreeSelectModule, SafeImageUrlPipe,
    ButtonModule, MessageModule, ImageModule, FileUploadModule, InputNumberModule, TreeSelectModule],

  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoFormComponent implements OnChanges, OnInit {
  @Output() guardar = new EventEmitter<{ data: ProductoRequest, imagenes?: File[] | null }>();
  @Output() cancelarEvento = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() producto: Producto | null = null;
  @Input() categorias: Categoria[] = [];
  @Input() resetTrigger: number = 0;

  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);
  private imageService = inject(ImageUploadService);

  abrirSelector = false;
  formSubmitted = false;
  productoForm!: FormGroup;
  categoriaTree: TreeNode[] = [];
  imagenesEliminada: string[] = [];
  imagenes: ImagenProductoUI[] = [];

  campoInvalido = (campo: string) => campoInvalido(this.productoForm, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
    this.cargarCategoriasEnTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.productoForm) return;
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.limpiarFormulario();
    }
    if (changes['categorias'] || (changes['producto'] && !this.producto)) {
      this.cargarCategoriasEnTree();
    }
    if (changes['producto']) {
      this.actualizarFormulario();
      if (this.producto?.urlsMultimedia?.length) {
        this.cargarImagenExistente(this.producto.urlsMultimedia);
      }
    }
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      idCategoria: [null, Validators.required],
      publicado: [false],
      estado: [false]
    });
  }

  private cargarImagenExistente(urls: string[]): void {
    const requests = urls.map(url => this.imageService.obtenerImagenProtegida(url));
    forkJoin(requests).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(blobs => {
      this.imagenes = [];
      blobs.forEach((blob, index) => {if (!blob) return;
        const file = new File([blob], `imagen-${index}.jpg`, { type: blob.type });
        this.imagenes.push({
          file,
          preview: URL.createObjectURL(file),
          nombre: `Imagen actual`,
          peso: this.imageService.obtenerReadableSize(file),
          tipo: 'existente',
          urlOriginal: urls[index]
        });
      });
      this.cd.detectChanges();
    });
  }

  onSeleccionarArchivo(event: any): void {
    const files: File[] = Array.from(event.files);
    const validas = this.imageService.imagenesValidas(files);
    validas.forEach(file => {
      this.imagenes.push({ file, preview: URL.createObjectURL(file), nombre: file.name, peso: this.imageService.obtenerReadableSize(file), tipo: 'nueva' });
    });
  }

  eliminarImagen(index: number): void {
    const img = this.imagenes[index];
    if (img.preview) { URL.revokeObjectURL(img.preview); }
    if (img.tipo === 'existente' && img.urlOriginal) { this.imagenesEliminada.push(img.urlOriginal); }
    this.imagenes.splice(index, 1);
  }

  private limpiarEstadoImagen(): void {
    this.imagenes.forEach(img => { if (img.preview) { URL.revokeObjectURL(img.preview); } });
    this.imagenes = [];
    this.imagenesEliminada = [];
    this.fileUpload?.clear();
  }

  private resetFormularioBase(): void {
    this.productoForm.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      publicado: false,
      estado: false,
      idCategoria: null
    });
    this.limpiarEstadoImagen();
  }

  private limpiarFormulario(): void {
    this.formSubmitted = false;
    this.resetFormularioBase();
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  private construirTree(categorias: Categoria[]): TreeNode[] {
    if (!Array.isArray(categorias)) { return []; }
    return categorias.map(categoria => ({
      label: categoria.nombre, key: String(categoria.id), data: categoria.id,
      children: categoria.subcategorias?.length ? this.construirTree(categoria.subcategorias) : []
    }));
  }

  cargarCategoriasEnTree(): void {
    this.categoriaTree = Array.isArray(this.categorias) ? this.construirTree(this.categorias) : [];
    this.cd.detectChanges();
  }

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

  private actualizarFormulario(): void {
    this.imagenesEliminada = [];
    if (this.producto) {
      this.productoForm.patchValue({
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion,
        precio: this.producto.precio,
        stock: this.producto.stock,
        publicado: this.producto.publicado,
        estado: this.producto.estado,
        idCategoria: null,
      });
    }
    if (this.producto?.idCategoria) {
      setTimeout(() => {
        if (this.categoriaTree.length && this.producto?.idCategoria) {
          const match = this.findTreeNodeById(this.categoriaTree, this.producto.idCategoria!);
          this.productoForm.patchValue({ idCategoria: match || null });
          this.cd.detectChanges();
        }
      });
    }
    else {
      this.resetFormularioBase();
    }
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  onCancelar(): void {
    this.formSubmitted = false;
    this.limpiarFormulario();
    this.abrirSelector = false;
    this.cancelarEvento.emit();
  }

  onGuardar(): void {
    this.formSubmitted = true;
    if (this.productoForm.invalid) { marcarFormulario(this.productoForm); return; }
    const archivos: File[] = this.imagenes.filter(img => img.file).map(img => img.file as File);
    const categoriaSeleccionada = this.productoForm.value.idCategoria;
    const data: ProductoRequest = {
      nombre: this.productoForm.value.nombre,
      descripcion: this.productoForm.value.descripcion,
      precio: this.productoForm.value.precio,
      stock: this.productoForm.value.stock,
      publicado: this.productoForm.value.publicado,
      estado: this.productoForm.value.estado,
      idCategoria: Number(categoriaSeleccionada.key)
    };
    this.guardar.emit({ data, imagenes: archivos.length ? archivos : undefined });
  }
}
