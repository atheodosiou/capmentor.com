import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'app_theme_v1';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app_theme_v1';

  // σωστό initialization
  private _mode = signal<ThemeMode>(this.loadInitialMode());
  isDark = signal<boolean>(false);

  constructor() {
    this.apply();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => this._mode() === 'system' && this.apply();
    mq.addEventListener('change', handler);
  }

  get mode() {
    return this._mode();
  }

  setMode(next: ThemeMode) {
    this._mode.set(next);
    localStorage.setItem(this.STORAGE_KEY, next);
    this.apply();
  }

  private apply() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = this._mode() === 'dark' || (this._mode() === 'system' && prefersDark);

    this.isDark.set(dark);

    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    html.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  private loadInitialMode(): ThemeMode {
    const stored = localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  }
}

