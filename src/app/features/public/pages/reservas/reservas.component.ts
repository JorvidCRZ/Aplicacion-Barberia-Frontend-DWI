import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TokenService } from '@/app/core/services/auth/token.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    
    <div *ngIf="!verificado" class="min-h-screen bg-black flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        <p class="text-white mt-4">Verificando acceso...</p>
      </div>
    </div>

    <p-dialog header="⚠️ Acceso restringido" [(visible)]="showModal" [modal]="true" [closable]="false"[dismissableMask]="false"[style]="{ width: '400px' }"> 
      <div class="text-center py-4">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
          <i class="pi pi-lock text-yellow-500 text-2xl"></i>
        </div>
        <h3 class="text-white text-xl font-bold mb-2">¡Necesitas iniciar sesión!</h3>
        <p class="text-gray-400 text-sm mb-6"> Para agendar una cita debes tener una cuenta activa.  Inicia sesión para continuar.</p>
        <div class="flex gap-3 justify-center">
          <button pButton label="Cancelar" (click)="cancelar()"class="boton-secondary"></button>
          <button  pButton label="Iniciar sesión"  (click)="irALogin()" class="boton-primary"></button>
        </div>
      </div>
    </p-dialog>
  `,

  styles: [`
    :host ::ng-deep .p-dialog .p-dialog-header {
      background-color: #0c0c0c;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    :host ::ng-deep .p-dialog .p-dialog-content {
      background-color: #0c0c0c;
    }
  `]
})
export class ReservasComponent implements OnInit {
  showModal = false;
  verificado = false;
  
  constructor(private tokenService: TokenService,private router: Router) {}
  
  ngOnInit(): void {
    this.verificarAutenticacion(); 
  }
  
  verificarAutenticacion(): void {
    setTimeout(() => {
      const isLoggedIn = this.tokenService.isLogged();
      
      if (isLoggedIn) {
        this.router.navigate(['/mi-cuenta/reservar/agendar']);
      } else {
      
        this.showModal = true;
      }
      
      this.verificado = true;
    }, 100);
  }
  
  irALogin(): void {
    this.showModal = false;
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: '/mi-cuenta/reservar/agendar' }
    });
  }
  
  cancelar(): void {
    this.showModal = false;
    this.router.navigate(['/']);
  }
}