import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
  <app-header/>
    <main class="min-h-screen pt-20 sm:pt-22">
      <router-outlet></router-outlet>
    </main>
  <app-footer/>`,})
export class PublicLayoutComponent {

}
