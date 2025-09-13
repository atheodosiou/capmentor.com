// src/app/core/services/inflation-state.service.ts
import { Injectable, computed, signal } from '@angular/core';
import type { InflationResult } from './inflation';

@Injectable({ providedIn: 'root' })
export class InflationStateService {
  // raw signals
  private _country = signal<string>('GR');
  private _year = signal<number | null>(null);
  private _value = signal<number>(0); // default 0 όπως ζήτησες
  private _source = signal<InflationResult['source']>('none');
  private _loading = signal<boolean>(false);

  // public readonly selectors
  country = this._country.asReadonly();
  year = this._year.asReadonly();
  value = this._value.asReadonly();
  source = this._source.asReadonly();
  loading = this._loading.asReadonly();

  data = computed(() => ({
    country: this._country(),
    year: this._year(),
    value: this._value(),
    source: this._source(),
    loading: this._loading(),
  }));

  /** Κάνε set από το API result */
  setFromResult(res: InflationResult) {
    this._country.set(res.country);
    this._year.set(res.year);
    this._value.set(res.value ?? 0); // null -> 0
    this._source.set(res.source);
  }

  /** Χρήσιμο όταν ξεκινάς ένα fetch */
  setLoading(v: boolean) {
    this._loading.set(v);
  }

  /** Manual set αν το θες ρητά */
  setManual(opts: { country?: string; year?: number | null; value?: number; source?: InflationResult['source'] }) {
    if (opts.country !== undefined) this._country.set(opts.country);
    if (opts.year !== undefined) this._year.set(opts.year);
    if (opts.value !== undefined) this._value.set(opts.value);
    if (opts.source !== undefined) this._source.set(opts.source);
  }

  /** Reset αν θες */
  reset() {
    this._country.set('GR');
    this._year.set(null);
    this._value.set(0);
    this._source.set('none');
    this._loading.set(false);
  }
}
