import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '@/app/core/services/auth/token.service';
import { PUBLIC_PAGES } from '@/app/core/config/sites.config';
import { LogoComponent } from '@/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  private tokenService = inject(TokenService);
  isAuthenticated = false;
  profileLink = ['/login'];

  publicNav = PUBLIC_PAGES;

  ngOnInit() {
    this.isAuthenticated = this.tokenService.isLogged();
    this.profileLink = [this.tokenService.getHomeByRole()];
  }
} 

