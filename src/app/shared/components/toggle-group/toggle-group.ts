import { Component, input, output, signal } from '@angular/core';
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

  localValue = signal(this.value() ?? 'end');

  select(v: 'begin' | 'end') {
    this.localValue.set(v);
    this.valueChange.emit(v);
  }

  btnClass(which: 'begin' | 'end') {
    const active = this.value() === which;
    return `flex-1 rounded-xl border px-3 py-2 text-sm ${active ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-300 hover:bg-slate-50'
      }`;
  }
}
