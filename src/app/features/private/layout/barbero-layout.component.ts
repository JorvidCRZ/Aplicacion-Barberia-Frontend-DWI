import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '@/app/core/services/auth/token.service';
import { PrivateShellComponent } from '@/app/features/private/layout/private-shell.component';

@Component({
  selector: 'app-barbero-layout',
  standalone: true,
  imports: [PrivateShellComponent, CommonModule],
  template: `<app-private-shell title="Panel Barbero" [userFullName]="userFullName" [showVerticalLine]="true"></app-private-shell>`,
})
export class BarberoLayoutComponent implements OnInit {
  private tokenService = inject(TokenService);

  userFullName = '';

  ngOnInit() {
    this.userFullName = this.tokenService.getUserDisplayName();
  }

}
