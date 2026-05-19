import { Component, computed, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type LogoVariant = 'logo' | 'icon';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <img [src]="logoFinal()" routerLink="/inicio" alt="Logo FadeX"
      class="h-14 md:h-18 lg:h-20 w-auto rounded-2xl object-contain cursor-pointer hover:scale-105 transition-transform"/> `,
})
export class LogoComponent {
  @Input() variant: LogoVariant = 'logo'; 
  @Input()
  set src(value: string | null | undefined) {
    this._src.set(value);
  }

  private readonly DEFAULT_LOGO = 'assets/Logo_FadeX.webp';
  private readonly ICON_LOGO = '/logo.webp';
  private _src = signal<string | null | undefined>(null);

  logoFinal = computed(() => {
    const src = this._src();
    switch (true) {
      case this.variant === 'icon': return this.ICON_LOGO;
      case !src: return this.DEFAULT_LOGO;
      case !!src && src.startsWith('http'): return src;
      default: return this.DEFAULT_LOGO;
    }
  });
}