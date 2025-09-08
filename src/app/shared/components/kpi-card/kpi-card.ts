import { Component, computed, input, signal } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss'
})
export class KpiCard {
  label = input.required<string>();
  value = input.required<string>();
  description = input<string>('');
  tooltipId = `kpi-tip-${++nextId}`;

  // signal για άνοιγμα/κλείσιμο tooltip
  private _open = signal(false);
  open = computed(() => !!this.description() && this._open());

  // events
  show() { if (this.description()) this._open.set(true); }
  hide() { this._open.set(false); }
  toggle() { if (this.description()) this._open.update(v => !v); }

  // για Esc στο button
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.hide();
  }
}
