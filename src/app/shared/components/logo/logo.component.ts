import { Component, computed, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type LogoVariant = 'logo' | 'icon';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
  <img
    [src]="logoFinal()"
    [routerLink]="['/']"
    alt="Logo FadeX"
    [class]="'w-auto rounded-2xl object-contain cursor-pointer hover:scale-105 transition-transform logo-fade ' + sizeClass()"
  />
`,
  styles: [`
    .logo-fade {
      mask-image: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0) 100%);
      -webkit-mask-image: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0) 100%);
    }
  `]
})

export class LogoComponent {
  @Input() variant: LogoVariant = 'logo';
  @Input() size: LogoSize = 'md';
  @Input()
  set src(value: string | null | undefined) {
    this._src.set(value);
  }

  private readonly DEFAULT_LOGO = 'assets/Logo_FadeX.webp';
  private readonly ICON_LOGO = '/logo.webp';
  private _src = signal<string | null | undefined>(null);

  private readonly SIZES = {
    sm: 'h-8 md:h-10',
    md: 'h-14 md:h-16 lg:h-20',
    lg: 'h-20 md:h-24 lg:h-28',
    xl: 'h-28 md:h-32 lg:h-40'
  };

  sizeClass = computed(() => this.SIZES[this.size]);

  logoFinal = computed(() => {
    const src = this._src();

    switch (true) {
      case this.variant === 'icon': return this.ICON_LOGO;
      case !!src: return src;
      default: return this.DEFAULT_LOGO;
    }
  });
}