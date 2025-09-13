import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

interface WbMeta {
  page: number; pages: number; per_page: number; total: number;
  source: Array<{ id: string; value: string }>;
}

interface WbDatum {
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
  unit: string | null; obs_status: string | null; decimal: number;
}

export interface InflationResult {
  country: string;   // ISO2/ISO3 
  year: number | null;
  value: number | null;  // annual %
  source: 'current-year' | 'latest-available' | 'none';
}

@Injectable({ providedIn: 'root' })
export class InflationService {
  private http = inject(HttpClient);
  private base = 'https://api.worldbank.org/v2';
  private indicator = 'FP.CPI.TOTL.ZG';

  getCurrentYearOrLatest(countryCode: string) {
    const year = new Date().getFullYear();
    const urlYear =
      `${this.base}/country/${encodeURIComponent(countryCode)}/indicator/${this.indicator}` +
      `?format=json&date=${year}:${year}&per_page=1`;

    return this.http.get<[WbMeta, WbDatum[]]>(urlYear).pipe(
      switchMap(resp => {
        const row = resp?.[1]?.[0];
        const value = row?.value ?? null;
        if (value != null) {
          return of<InflationResult>({
            country: countryCode,
            year,
            value,
            source: 'current-year',
          });
        }
        const urlLatest =
          `${this.base}/country/${encodeURIComponent(countryCode)}/indicator/${this.indicator}` +
          `?format=json&mrnev=1`;
        return this.http.get<[WbMeta, WbDatum[]]>(urlLatest).pipe(
          map(resp2 => {
            const latest = resp2?.[1]?.find(r => r?.value != null);
            if (!latest) {
              return { country: countryCode, year: null, value: null, source: 'none' } as InflationResult;
            }
            return {
              country: countryCode,
              year: Number(latest.date) || null,
              value: latest.value,
              source: 'latest-available',
            } as InflationResult;
          }),
          catchError(() => of<InflationResult>({ country: countryCode, year: null, value: null, source: 'none' }))
        );
      }),
      catchError(() => of<InflationResult>({ country: countryCode, year: null, value: null, source: 'none' }))
    );
  }

  getLatest(countryCode: string) {
    const url =
      `${this.base}/country/${encodeURIComponent(countryCode)}/indicator/${this.indicator}` +
      `?format=json&mrnev=1`;
    return this.http.get<[WbMeta, WbDatum[]]>(url);
  }

  getRange(countryCode: string, from: number, to: number) {
    const url =
      `${this.base}/country/${encodeURIComponent(countryCode)}/indicator/${this.indicator}` +
      `?format=json&date=${from}:${to}&per_page=200`;
    return this.http.get<[WbMeta, WbDatum[]]>(url);
  }
}
