import { Component, inject } from '@angular/core';
import { CompoundStore } from '../../state/compound.store';
import { downloadCsv } from '../../../../shared/utils/csv.util';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar-actions',
  imports: [TranslatePipe],
  templateUrl: './toolbar-actions.html',
  styleUrl: './toolbar-actions.scss'
})
export class ToolbarActions {
  store = inject(CompoundStore)

  exportCsv() {
    const rows: (string | number)[][] = [
      ['Year', 'TotalContribution', 'TotalInterest', 'Balance', 'RealBalance'],
      ...this.store.yearlySchedule().map(r => [
        r.year, r.totalContrib.toFixed(2), r.totalInterest.toFixed(2),
        r.balance.toFixed(2), r.realBalance.toFixed(2)
      ]),
    ];

    downloadCsv(`compound_interest_${Date.now()}.csv`, rows);
  }
}
