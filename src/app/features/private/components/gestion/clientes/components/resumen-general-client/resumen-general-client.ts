import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteResumen } from '@/app/core/models/gestion/cliente/ClienteResumen.model';
import { OnInit, inject } from '@angular/core';
import { ClienteService } from '@/app/core/services/gestion/cliente.service';
@Component({
  selector: 'app-resumen-general-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-general-client.html',
  styleUrl: './resumen-general-client.css',
})
export class ResumenGeneralClient implements OnInit {
  private clienteService = inject(ClienteService);
  resumen: any[] = [];


  ngOnInit(): void {

    this.clienteService.obtenerResumen()
      .subscribe({

        next: (response) => {

          const data: ClienteResumen = response.data;

          this.resumen = [

            {
              valor: data.totalClientes,
              titulo: 'Total clientes',
              delta: data.deltaTotalClientes,
              positivo: true,
              icono: 'pi-users'
            },

            {
              valor: data.clientesActivosMes,
              titulo: 'Activos este mes',
              delta: data.deltaClientesActivos,
              positivo: true,
              icono: 'pi-calendar-check'
            },

            {
              valor: data.nuevosClientes,
              titulo: 'Nuevos clientes',
              delta: data.deltaNuevosClientes,
              positivo: true,
              icono: 'pi-user-plus'
            },

            {
              valor: `${data.retencion.toFixed(2)}%`,
              titulo: 'Retención',
              delta: data.deltaRetencion,
              positivo: data.retencion >= 50,
              icono: 'pi-chart-line'
            }

          ];

        },

        error: (err) => {
          console.error(err);
        }

      });

  }
}
