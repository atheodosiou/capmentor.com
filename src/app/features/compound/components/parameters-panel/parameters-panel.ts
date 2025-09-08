import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ToggleGroup } from '../../../../shared/components/toggle-group/toggle-group';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, map, distinctUntilChanged } from 'rxjs';
import { CompoundStore } from '../../state/compound.store';
import { coerceNum } from '../../../../shared/utils/number.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
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

  constructor() {
    // 1) Initialize form from store (once on create)
    const s = this.store.inputs();
    this.form.patchValue({
      initial: s.initial,
      monthly: s.monthly,
      years: s.years,
      annualRatePct: s.annualRatePct,
      inflationPct: s.inflationPct,
      timing: s.timing,
    }, { emitEvent: false });

    // 2) Form -> Store (debounced, distinct, with number coercion)
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
        if (this.patching()) return; // skip if we’re currently syncing from store
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
  }

  // hook for toggle component
  onTimingChange(v: 'begin' | 'end') {
    this.form.get('timing')!.setValue(v);
  }
}
