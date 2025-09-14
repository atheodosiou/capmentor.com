import { Component, input, output, signal, effect } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-toggle-group',
  imports: [TranslatePipe],
  templateUrl: './toggle-group.html',
  styleUrl: './toggle-group.scss',
})
export class ToggleGroup {
  value = input<'begin' | 'end'>('end');
  valueChange = output<'begin' | 'end'>();
  localValue = signal<'begin' | 'end'>(this.value());

  constructor() {
    effect(() => this.localValue.set(this.value()));
  }

  select(v: 'begin' | 'end') {
    if (this.localValue() !== v) {
      this.localValue.set(v);
      this.valueChange.emit(v);
    }
  }

  btnClass(which: 'begin' | 'end') {
    const active = this.localValue() === which;

    const base =
      'flex-1 rounded-xl border px-3 py-2 text-sm cursor-pointer select-none ' +
      'transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
      'focus-visible:ring-slate-400 ring-offset-2 ring-offset-white ' +
      'dark:ring-offset-slate-800';

    if (active) {
      return (
        base +
        ' border-slate-900 bg-slate-900 text-white ' +
        ' dark:border-slate-600 dark:bg-slate-900 dark:text-white'
      );
    }
    return (
      base +
      ' border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 ' + 
      ' dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-500'
    );
  }
}
