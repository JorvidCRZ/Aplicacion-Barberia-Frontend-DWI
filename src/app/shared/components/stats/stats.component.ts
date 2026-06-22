
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCard } from '@/app/core/models/common/card.model';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class StatsComponent {
  @Input({ required: true })
  items: StatsCard[] = [];
}
