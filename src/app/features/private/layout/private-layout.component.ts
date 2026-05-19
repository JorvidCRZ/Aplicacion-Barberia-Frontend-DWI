import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-empleado-layout',
    imports: [SidebarComponent, RouterOutlet],
    template: `
  <div class="flex h-screen overflow-hidden bg-brand-black">
    <app-sidebar class="w-[290px] shrink-0 h-screen border-r border-ui-border bg-brand-black" />
    
    <div class="flex flex-col flex-1">
      <div class="h-16 bg-ui-black border-b border-ui-border flex items-center px-6">
        <span class="text-white font-semibold">Panel Administrador</span>
      </div>
      
      <div class="flex-1 overflow-y-auto p-6 bg-brand-black">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `,
})
export class PrivateLayoutComponent {

}
