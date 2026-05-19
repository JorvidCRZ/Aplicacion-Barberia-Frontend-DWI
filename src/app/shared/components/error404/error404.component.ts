import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error404',
  imports: [LogoComponent],
  template: `
  <div class="flex flex-col items-center justify-center h-full text-center bg-black min-h-screen">
    <div class="mb-8">
      <app-logo class="w-32 h-32" />
    </div>
    <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-5xl text-brand-gold mr-4"></i>
        <h1 class="text-4xl font-bold mb-4 text-brand-gold">Error 404: Página no encontrada</h1>
    </div>
    <p class="text-text-muted"> Lo sentimos, la página que estás buscando no existe.</p>
  </div>`,
})
export class Error404Component {

}
