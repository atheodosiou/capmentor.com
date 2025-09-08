import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
   private fmt = new Intl.NumberFormat('el-GR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  });
  format(v: number | null | undefined): string { return this.fmt.format(v ?? 0); }
}
