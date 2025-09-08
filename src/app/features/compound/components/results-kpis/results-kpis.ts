import { Component, inject } from '@angular/core';
import { KpiCard } from '../../../../shared/components/kpi-card/kpi-card';
import { CompoundStore } from '../../state/compound.store';
import { CurrencyService } from '../../../../core/services/currency';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-results-kpis',
  imports: [KpiCard, TranslatePipe],
  templateUrl: './results-kpis.html',
  styleUrl: './results-kpis.scss'
})
export class ResultsKpis {
  store = inject(CompoundStore);
  cur = inject(CurrencyService);
  fmt = (v: number) => this.cur.format(v);
}
