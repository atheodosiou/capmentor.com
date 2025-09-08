import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal, Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// API shape: { date: 'YYYY-MM-DD', [base]: { usd: 1.09, ... } }
interface CurrencyRatesResponse {
  date: string;
  [base: string]: any; // πιο αυστηρά: Record<string, number> αλλά αφήνουμε το 'date'
}

interface PairRow {
  pair: string;        // π.χ. EUR/USD
  rate: number;        // σημερινή ισοτιμία
  changePct?: number;  // % μεταβολή σε σχέση με χθες
}

@Component({
  selector: 'app-currency-ticker',
  imports: [DecimalPipe],
  templateUrl: './currency-ticker.html',
  styleUrl: './currency-ticker.scss'
})
export class CurrencyTicker {
  private http = inject(HttpClient);

  // Inputs ως signals
  base = input.required<string>();
  targets = input<string[]>(['USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'TRY']);
  speed = input<number>(30);

  // internal state
  private todayRates = signal<CurrencyRatesResponse | null>(null);
  private yesterdayRates = signal<CurrencyRatesResponse | null>(null);

  // υπολογισμός rows για το ticker
  rows: Signal<PairRow[]> = computed(() => {
    const base = (this.base() || 'EUR').toLowerCase();
    const today = this.todayRates();
    const yesterday = this.yesterdayRates();

    // maps για τη βάση
    const todayMap = (today?.[base] as Record<string, number> | undefined) ?? undefined;
    const yestMap = (yesterday?.[base] as Record<string, number> | undefined) ?? undefined;

    if (!todayMap) return [];

    return this.targets()
      .filter(t => t.toUpperCase() !== this.base()?.toUpperCase())
      .map(t => {
        const tgt = t.toLowerCase();
        const rate = todayMap[tgt];
        let changePct: number | undefined;

        if (yestMap && typeof rate === 'number') {
          const yRate = yestMap[tgt];
          if (typeof yRate === 'number' && yRate !== 0) {
            changePct = ((rate - yRate) / yRate) * 100;
          }
        }

        return {
          pair: `${this.base().toUpperCase()}/${t.toUpperCase()}`,
          rate,
          changePct
        } as PairRow;
      })
      .filter(r => typeof r.rate === 'number');
  });

  // refetch όταν αλλάζει base + ανά τακτά διαστήματα
  private cleanup?: () => void;

  constructor() {
    // Reactive fetch όταν αλλάζει το base input
    effect(() => {
      this.base();            // declare dependency
      this.fetchBothDays();
    });

    // periodic refresh (π.χ. ανά 10 λεπτά)
    const id = setInterval(() => this.fetchBothDays(), 10 * 60 * 1000);
    this.cleanup = () => clearInterval(id);
  }

  ngOnDestroy() { this.cleanup?.(); }

  private async fetchBothDays() {
    const baseVal = this.base();
    if (!baseVal) return;

    const baseLower = baseVal.toLowerCase();
    try {
      // today
      const todayUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseLower}.json?d=${Date.now()}`;

      const todayData = await firstValueFrom(this.http.get<CurrencyRatesResponse>(todayUrl));

      // yesterday (YYYY-MM-DD)
      const d = new Date();
      d.setDate(d.getDate() - 2);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const date = `${yyyy}-${mm}-${dd}`;
      const yUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${baseLower}.json?d=${Date.now()}`;

      const yData = await firstValueFrom(this.http.get<CurrencyRatesResponse>(yUrl));

      this.todayRates.set(todayData);
      this.yesterdayRates.set(yData);
    } catch {
      // graceful fallback: αν αποτύχει το χθεσινό, δείξε μόνο τρέχουσα ισοτιμία χωρίς change
      this.yesterdayRates.set(null);
    }
  }

  trackByPair = (_: number, row: PairRow) => row.pair;

}
