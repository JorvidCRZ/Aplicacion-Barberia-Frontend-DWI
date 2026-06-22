
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { ReclamoService } from '@/app/core/services/operaciones/reclamo.service';
import { ReclamoResponse } from '@/app/core/models/operaciones/reclamos-model/reclamo.model';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ImageModule } from 'primeng/image';
import { environment } from '@/environments/environment.development';
import { formatearTexto } from '@/app/shared/utils/formatear-text.utils.component';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';

@Component({
  selector: 'app-reclamo-detalle',
  imports: [ButtonModule, CommonModule, StatusBadgeComponent, ImageModule, SafeImageUrlPipe ] ,
  templateUrl: './reclamo-detalle.html',
  styleUrl: './reclamo-detalle.css',
})
export class ReclamoDetalleComponent implements OnInit {

  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private notify = inject(NotificationService);
  private reclamoService = inject(ReclamoService);

  environment = environment.apiUrl;
  detalleReclamo?: ReclamoResponse;
  cargando = true;

  formatearTexto = formatearTexto;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.obtenerDetalleReclamo(id);
  }

  volver() {
    this.router.navigate(['/dashboard/admin/operaciones/reclamos']);
  }

  private obtenerDetalleReclamo(id: number) {
    this.reclamoService.obtenerReclamoPorId(id).subscribe({
      next: (resp) => {
        this.detalleReclamo = resp.data;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.cd.detectChanges();
        this.notify.showHttpError(err);
      }
    });
  }
}