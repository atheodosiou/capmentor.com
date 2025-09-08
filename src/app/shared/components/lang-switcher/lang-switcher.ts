import { Component, computed, inject, signal } from '@angular/core';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lang-switcher',
  imports: [TranslatePipe],
  templateUrl: './lang-switcher.html',
  styleUrl: './lang-switcher.scss'
})
export class LangSwitcher {
  private t = inject(TranslateService);
  private sub?: Subscription;

  lang = signal<'el' | 'en'>((this.t.currentLang as any) || (this.t.defaultLang as any) || 'el');

  constructor() {
    this.sub = this.t.onLangChange.subscribe((e: LangChangeEvent) => {
      this.lang.set((e.lang as 'el' | 'en') || 'el');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggle() {
    const next = this.lang() === 'el' ? 'en' : 'el';
    this.t.use(next);
    localStorage.setItem('lang', next);
    document.documentElement.setAttribute('lang', next);
    this.lang.set(next);
  }
}
