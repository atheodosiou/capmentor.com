// src/app/core/services/geo-country.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeoCountryService {
  private http = inject(HttpClient);
  private cacheKey = 'geoCountryISO2';
  private ttlMs = 24 * 60 * 60 * 1000; // 24h

  /** Παίρνει ISO2 χώρας από IP (π.χ. "GR"). Με cache 24h. */
  getCountryISO2(defaultIso2 = 'GR') {
    // 1) localStorage cache
    const cached = localStorage.getItem(this.cacheKey);
    if (cached) {
      try {
        const { t, code } = JSON.parse(cached);
        if (Date.now() - t < this.ttlMs && typeof code === 'string' && code.length === 2) {
          return of(code);
        }
      } catch { }
    }

    // 2) Προσπάθησε ipwho.is → country_code
    return this.http.get<any>('https://ipwho.is/').pipe(
      map(res => {
        const code = (res?.country_code || '').toString().toUpperCase();
        return (code.length === 2) ? code : defaultIso2;
      }),
      catchError(() => of(null)),
      switchMap(code => {
        if (code) return of(code);
        // 3) Fallback ipapi.co → country_code
        return this.http.get<any>('https://ipapi.co/json/').pipe(
          map(res => {
            const c = (res?.country_code || '').toString().toUpperCase();
            return (c.length === 2) ? c : defaultIso2;
          }),
          catchError(() => of(defaultIso2))
        );
      }),
      map(code => {
        // αποθήκευση cache
        try { localStorage.setItem(this.cacheKey, JSON.stringify({ t: Date.now(), code })); } catch { }
        return code;
      })
    );
  }
}
