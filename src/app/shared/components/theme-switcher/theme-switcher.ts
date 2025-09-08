import { Component, computed, inject } from '@angular/core';
import { ThemeMode, ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-theme-switcher',
  imports: [],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss'
})
export class ThemeSwitcher {
  private theme = inject(ThemeService);
  isDark = computed(() => this.theme.isDark());

  toggle() {
    const next = !this.isDark();
    this.theme.setMode(next ? 'dark' : 'light');
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
    if (e.key === 'ArrowLeft') this.theme.setMode('light');
    if (e.key === 'ArrowRight') this.theme.setMode('dark');
  }


}
