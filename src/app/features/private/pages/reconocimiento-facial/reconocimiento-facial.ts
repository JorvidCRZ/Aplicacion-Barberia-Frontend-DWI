import { AnalisisResponse } from '@/app/core/models/reconocimiento-facial/Ia.model';
import { IaService } from '@/app/core/services/reconocimiento-facial/reconocimiento-facial.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Camara } from './components/camara/camara';
import { Resultado } from './components/resultado/resultado';



@Component({
  selector: 'app-reconocimiento-facial',
  standalone: true,
  imports: [
    CommonModule,
    Camara,
    Resultado
  ],
  templateUrl: './reconocimiento-facial.html',
  styleUrl: './reconocimiento-facial.css',
})
export class ReconocimientoFacial {

  

  previewFoto = '';

  onPreview(url: string) {
    this.previewFoto = url;
  }
  fotoBlob?: Blob;

  resultado?: AnalisisResponse;

  cargando = false;

  error = '';

  // TEMPORAL
  idCliente = 0;
  ngOnInit(): void {
  this.iaService.obtenerMiClienteId().subscribe({
    next: (res) => this.idCliente = res.data,
    error: () => this.error = 'No se pudo obtener el perfil de cliente'
  });
}
  

  constructor(
    private iaService: IaService
  ) { }

  onFotoTomada(blob: Blob) {
    console.log('Foto recibida');
    this.fotoBlob = blob;
  }

  analizar() {

  if (!this.fotoBlob) {
    this.error = 'Primero toma una fotografía para iniciar el análisis facial.';
    return;
  }

  this.cargando = true;
  this.error = '';

  this.iaService
    .analizar(this.fotoBlob, this.idCliente)
    .subscribe({
      next: (resp) => {
        this.resultado = resp;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al analizar la imagen';
        this.cargando = false;
      }
    });
}

  reiniciar() {
    this.resultado = undefined;
    this.fotoBlob = undefined;
    this.error = '';
  }

  analizarOtraVez() {
  window.location.reload();
}
}