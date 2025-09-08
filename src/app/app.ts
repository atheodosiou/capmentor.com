import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LangSwitcher } from './shared/components/lang-switcher/lang-switcher';
import { CurrencyTicker } from './shared/components/currency-ticker/currency-ticker';
import { ThemeSwitcher } from './shared/components/theme-switcher/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LangSwitcher, TranslatePipe, CurrencyTicker, ThemeSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('compound-interest-calculator');
  year = signal(new Date().getFullYear());
  currencyTargets = signal<string[]>(['USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'TRY',
    'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF',
    'BRL', 'MXN',
    'HKD', 'SGD', 'INR', 'KRW', 'NZD',
    'AED', 'SAR', 'ZAR']
  );
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['el', 'en']);
    this.translate.setFallbackLang('el');

    const saved = localStorage.getItem('lang') as 'el' | 'en' | null;
    if (!saved)
      this.translate.use('el');
    else this.translate.use(saved);
  }

}
