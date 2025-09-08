import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import {
  NgxApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexGrid,
  ApexDataLabels,
} from 'ngx-apexcharts';
import { CompoundStore } from '../../state/compound.store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-yearly-chart',
  standalone: true,
  imports: [NgxApexchartsModule, TranslatePipe],
  templateUrl: './yearly-chart.html',
  styleUrls: ['./yearly-chart.scss'],
})
export class YearlyChart implements OnDestroy {
  private readonly store = inject(CompoundStore);
  private readonly translate = inject(TranslateService);

  // triggers
  private langTick = signal(0);
  private themeTick = signal(0);

  private mo = new MutationObserver(() => this.themeTick.update(v => v + 1));

  constructor() {
    // re-run series names on language change
    this.translate.onLangChange.subscribe(() => this.langTick.update(v => v + 1));

    // observe <html class="dark"> changes to refresh chart colors/tooltips
    this.mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  ngOnDestroy() {
    this.mo.disconnect();
  }

  // helper
  private isDark() {
    // touch the signal so computed() re-runs when theme changes
    this.themeTick();
    return document.documentElement.classList.contains('dark');
  }

  series = computed<ApexAxisChartSeries>(() => {
    this.langTick(); // dependency για μεταφράσεις legend
    const y = this.store.yearlySchedule();
    return [
      {
        name: this.translate.instant('chart.legend.nominal'),
        data: y.map(r => Math.round(r.balance)),
      },
      {
        name: this.translate.instant('chart.legend.real'),
        data: y.map(r => Math.round(r.realBalance)),
      },
      {
        name: this.translate.instant('chart.legend.contrib'),
        data: y.map(r => Math.round(r.totalContrib)),
      },
    ];
  });

  chart = computed<ApexChart>(() => ({
    type: 'area',
    height: 320,
    toolbar: { show: false },
    background: 'transparent',
    foreColor: this.isDark() ? '#CBD5E1' /* slate-300 */ : '#334155' /* slate-700 */,
  }));

  xaxis = computed<ApexXAxis>(() => ({
    categories: this.store.yearlySchedule().map(r => r.year.toString()),
  }));

  yaxis = computed<ApexYAxis>(() => ({
    labels: { formatter: (v: number) => `${Math.round(v / 1000)}k` },
  }));

  stroke = computed(() => ({ curve: 'smooth', width: 2 }) as ApexStroke);

  legend = computed<ApexLegend>(() => ({ position: 'top' }));

  tooltip = computed<ApexTooltip>(() => ({
    theme: (this.isDark() ? 'dark' : 'light') as 'dark' | 'light',
    y: {
      formatter: (v: number) =>
        new Intl.NumberFormat('el-GR', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(v),
    },
  }));

  fill = computed<ApexFill>(() => ({
    type: 'gradient',
    gradient: { opacityFrom: 0.35, opacityTo: 0.05 },
  }));

  grid = computed<ApexGrid>(() => ({
    strokeDashArray: 3,
    borderColor: this.isDark() ? '#475569' /* slate-600 */ : '#E2E8F0' /* slate-200 */,
  }));

  dataLabels = computed<ApexDataLabels>(() => ({ enabled: false }));
}
