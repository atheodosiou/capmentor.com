import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ToggleGroup } from '../../../../shared/components/toggle-group/toggle-group';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, map, distinctUntilChanged } from 'rxjs';
import { CompoundStore } from '../../state/compound.store';
import { coerceNum } from '../../../../shared/utils/number.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { InflationStateService } from '../../../../core/services/inflation-state';

@Component({
  selector: 'app-parameters-panel',
  imports: [ReactiveFormsModule, ToggleGroup, DecimalPipe, TranslatePipe],
  templateUrl: './parameters-panel.html',
  styleUrl: './parameters-panel.scss'
})
export class ParametersPanel {
  private fb = inject(FormBuilder);
  private store = inject(CompoundStore);
  private destroyRef = inject(DestroyRef);
  private inflState = inject(InflationStateService);

  // guard to prevent feedback loops when we patch the form from the store
  private patching = signal(false);

  form = this.fb.group({
    initial: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    monthly: this.fb.control<number>(100, { nonNullable: true, validators: [Validators.min(0)] }),
    years: this.fb.control<number>(20, { nonNullable: true, validators: [Validators.min(1), Validators.max(50)] }),
    annualRatePct: this.fb.control<number>(10, { nonNullable: true, validators: [Validators.min(-50), Validators.max(50)] }),
    inflationPct: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(20)] }),
    timing: this.fb.control<'begin' | 'end'>('end', { nonNullable: true }),
  });

  inflLoading = this.inflState.loading;
  inflValue = this.inflState.value;
  infCountry = this.inflState.country;
  infYear = this.inflState.year;
  infSource = this.inflState.source;

  constructor() {
    const s = this.store.inputs();
    this.form.patchValue({
      initial: s.initial,
      monthly: s.monthly,
      years: s.years,
      annualRatePct: s.annualRatePct,
      inflationPct: s.inflationPct,
      timing: s.timing,
    }, { emitEvent: false });

    this.form.valueChanges
      .pipe(
        debounceTime(50),
        map(v => ({
          initial: coerceNum(v.initial, 0),
          monthly: coerceNum(v.monthly, 0),
          years: coerceNum(v.years, 1),
          annualRatePct: coerceNum(v.annualRatePct, 0),
          inflationPct: coerceNum(v.inflationPct, 0),
          timing: (v.timing ?? 'end') as 'begin' | 'end',
        })),
        distinctUntilChanged((a, b) =>
          a.initial === b.initial &&
          a.monthly === b.monthly &&
          a.years === b.years &&
          a.annualRatePct === b.annualRatePct &&
          a.inflationPct === b.inflationPct &&
          a.timing === b.timing
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(val => {
        if (this.patching()) return;
        this.store.patchInputs(val);
      });

    // 3) Store -> Form (if something else changes the store)
    effect(() => {
      const i = this.store.inputs();
      this.patching.set(true);
      this.form.patchValue(
        {
          initial: i.initial,
          monthly: i.monthly,
          years: i.years,
          annualRatePct: i.annualRatePct,
          inflationPct: i.inflationPct,
          timing: i.timing,
        },
        { emitEvent: false }
      );
      this.patching.set(false);
    });

    // 4) ⬅️ InflationState -> Form (auto-fill όταν έρθουν δεδομένα)
    effect(() => {
      const loading = this.inflState.loading();   // αν θες μπορείς να το αγνοήσεις
      const val = this.inflState.value();         // ΠΑΝΤΑ αριθμός (το state κάνει null->0)
      // μόνο αν διαφέρει από το τωρινό control value, κάνε set
      const current = this.form.get('inflationPct')!.value ?? 0;
      if (val !== current) {
        // Θέλουμε να σταλεί στο store; Τότε emitEvent: true
        this.form.get('inflationPct')!.setValue(val, { emitEvent: true });
      }
    });
  }

  // hook for toggle component
  onTimingChange(v: 'begin' | 'end') {
    this.form.get('timing')!.setValue(v);
  }

  tooltipId = 'inflation-tip-' + Math.random().toString(36).slice(2);
  tipOpen = signal(false);

  showTip() { this.tipOpen.set(true); }
  hideTip() { this.tipOpen.set(false); }

}
