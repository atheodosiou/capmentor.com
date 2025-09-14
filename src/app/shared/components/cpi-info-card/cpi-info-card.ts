import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cpi-info-card',
  imports: [TranslatePipe],
  templateUrl: './cpi-info-card.html',
  styleUrl: './cpi-info-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpiInfoCard {
  infoOpen = signal(false);
  infoId = 'cpi-info-' + Math.random().toString(36).slice(2);
  toggleInfo() { this.infoOpen.update(v => !v); }
}
