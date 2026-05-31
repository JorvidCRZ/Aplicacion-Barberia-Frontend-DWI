import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PUBLIC_PAGES } from '@/app/core/config/sites.config';
import { ButtonDirective, ButtonModule } from "primeng/button";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, ButtonDirective, ButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {

  publicNav = PUBLIC_PAGES;

}
