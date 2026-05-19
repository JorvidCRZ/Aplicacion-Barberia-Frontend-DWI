import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TokenService } from '../../../../core/services/auth/token.service';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-administrativo',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, CommonModule, AvatarModule],
  templateUrl: './dashboard-administrativo.html',
  styleUrl: './dashboard-administrativo.css',
})
export class DashboardGenericoComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);

  sidebarVisible = true;
  sidebarCollapsed = false;
  dashboardPrefix = '/dashboard-admin';
  userFullName = '';
  private userProfileSub?: Subscription;

  ngOnInit() {
    this.userFullName = this.tokenService.getUserDisplayName();
  }
  
  ngOnDestroy() {
    this.userProfileSub?.unsubscribe();
  }


  toggleSidebar() {
    if (window.innerWidth >= 768) {this.sidebarCollapsed = !this.sidebarCollapsed;} 
    else {this.sidebarVisible = !this.sidebarVisible;}
  }
}
