import { Component } from '@angular/core';
import { ParametersPanel } from '../../components/parameters-panel/parameters-panel';
import { ResultsKpis } from '../../components/results-kpis/results-kpis';
import { ToolbarActions } from '../../components/toolbar-actions/toolbar-actions';
import { YearlyChart } from '../../components/yearly-chart/yearly-chart';
import { YearlyTable } from '../../components/yearly-table/yearly-table';
import { CpiInfoCard } from '../../../../shared/components/cpi-info-card/cpi-info-card';

@Component({
  selector: 'app-compound-page',
  imports: [
    ParametersPanel,
    ResultsKpis,
    YearlyChart,
    YearlyTable,
    ToolbarActions,
    CpiInfoCard
  ],
  templateUrl: './compound-page.html',
  styleUrl: './compound-page.scss'
})
export class CompoundPage {
 
}
