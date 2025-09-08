import { Component, inject } from '@angular/core';
import { CurrencyService } from '../../../../core/services/currency';
import { CompoundStore } from '../../state/compound.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-yearly-table',
  imports: [TranslatePipe],
  templateUrl: './yearly-table.html',
  styleUrl: './yearly-table.scss'
})
export class YearlyTable {
  store = inject(CompoundStore);
  cur = inject(CurrencyService);
  fmt = (v: number) => this.cur.format(v);
}
