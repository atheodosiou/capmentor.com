import { Component } from '@angular/core';
import { ParametersPanel } from '../../components/parameters-panel/parameters-panel';
import { ResultsKpis } from '../../components/results-kpis/results-kpis';
import { YearlyChart } from '../../components/yearly-chart/yearly-chart';
import { YearlyTable } from '../../components/yearly-table/yearly-table';
import { ToolbarActions } from '../../components/toolbar-actions/toolbar-actions';

@Component({
  selector: 'app-compound-page',
  imports: [
    ParametersPanel,
    ResultsKpis,
    YearlyChart,
    YearlyTable,
    ToolbarActions
  ],
  templateUrl: './compound-page.html',
  styleUrl: './compound-page.scss'
})
export class CompoundPage {

}
