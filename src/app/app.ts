// app.ts
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LangSwitcher } from './shared/components/lang-switcher/lang-switcher';
import { CurrencyTicker } from './shared/components/currency-ticker/currency-ticker';
import { ThemeSwitcher } from './shared/components/theme-switcher/theme-switcher';
import { InflationService } from './core/services/inflation';
import { GeoCountryService } from './core/services/geocountry';
import { Subscription, switchMap, catchError, of } from 'rxjs';
import { InflationStateService } from './core/services/inflation-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LangSwitcher, TranslatePipe, CurrencyTicker, ThemeSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Capmentor.com');
  year = signal(new Date().getFullYear());

  // Κεντρικό state (διάβασε το απευθείας στο template)
  state = inject(InflationStateService);

  // Άλλα που ήδη έχεις
  currencyTargets = signal<string[]>([
    'USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'TRY',
    'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF',
    'BRL', 'MXN',
    'HKD', 'SGD', 'INR', 'KRW', 'NZD',
    'AED', 'SAR', 'ZAR'
  ]);

  /** Services */
  private readonly translate = inject(TranslateService);
  private readonly inflationService = inject(InflationService);
  private readonly geo = inject(GeoCountryService);

  private sub?: Subscription;

  constructor() {
    // === Γλώσσα (μένει όπως την είχες) ===
    this.translate.addLangs(['el', 'en']);
    this.translate.setFallbackLang('el');

    const saved = localStorage.getItem('lang') as 'el' | 'en' | null;
    const supported: Array<'el' | 'en'> = ['el', 'en'];

    if (saved && supported.includes(saved)) {
      this.translate.use(saved);
    } else {
      const prefs = [
        ...(Array.isArray(navigator.languages) ? navigator.languages : []),
        navigator.language,
      ].filter(Boolean).map(l => l.toLowerCase());

      let resolved: 'el' | 'en' | undefined;
      for (const p of prefs) {
        const base = p.split('-')[0] as 'el' | 'en';
        if (supported.includes(base)) { resolved = base; break; }
      }
      this.translate.use(resolved ?? 'el');
    }
  }

  ngOnInit(): void {
    // Geo → Inflation → State
    this.state.setLoading(true);

    this.sub = this.geo.getCountryISO2('GR') // default GR αν αποτύχει
      .pipe(
        switchMap(country => {
          // αποθήκευσε άμεσα τη χώρα στο state (ώστε να τη δει και το UI)
          this.state.setManual({ country });
          return this.inflationService.getCurrentYearOrLatest(country);
        }),
        catchError(() => {
          // Σε οποιοδήποτε σφάλμα γράψε fallback στο state
          return of({ country: 'GR', year: null, value: null, source: 'none' as const });
        })
      )
      .subscribe(res => {
        // Γράψε το normalized αποτέλεσμα στο κεντρικό state (null → 0 γίνεται εδώ)
        this.state.setFromResult(res);
        this.state.setLoading(false);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
