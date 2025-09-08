import { Injectable, computed, signal, effect } from '@angular/core';
import { CompoundInputs } from '../models/compound-inputs.model';
import { YearRow } from '../models/schedule.model';
import { effectiveMonthly } from '../../../shared/utils/math.util';
import { LocalStorageService } from '../../../core/services/local-storage';

const STORAGE_KEY = 'compound_inputs_v1';

@Injectable({ providedIn: 'root' })
export class CompoundStore {
    // inputs
    readonly inputs = signal<CompoundInputs>({
        initial: 0,
        monthly: 100,
        years: 20,
        annualRatePct: 10,
        inflationPct: 0,
        timing: 'end',
    });

    constructor(private ls: LocalStorageService) {
        const saved = this.ls.get<CompoundInputs>(STORAGE_KEY);
        if (saved) this.inputs.set(saved);

        effect(() => {
            this.ls.set(STORAGE_KEY, this.inputs());
        });
    }

    // derived
    readonly months = computed(() => Math.max(0, Math.round(this.inputs().years * 12)));
    readonly monthlyRate = computed(() => effectiveMonthly(this.inputs().annualRatePct));

    readonly yearlySchedule = computed<YearRow[]>(() => {
        const { initial, monthly, inflationPct, timing } = this.inputs();
        const months = this.months();
        const r = this.monthlyRate();

        let bal = Math.max(0, initial);
        let totalContrib = 0;
        let totalInterest = 0;
        const rows: YearRow[] = [];
        const infl = Math.max(0, inflationPct / 100);

        for (let m = 1; m <= months; m++) {
            if (timing === 'begin') {
                bal += Math.max(0, monthly);
                totalContrib += Math.max(0, monthly);
            }

            const interest = bal * r;
            bal += interest;
            totalInterest += interest;

            if (timing === 'end') {
                bal += Math.max(0, monthly);
                totalContrib += Math.max(0, monthly);
            }

            if (m % 12 === 0) {
                const year = m / 12;
                const real = infl > 0 ? bal / Math.pow(1 + infl, year) : bal;
                rows.push({ year, balance: bal, realBalance: real, totalContrib, totalInterest });
            }
        }
        return rows;
    });

    // KPIs
    readonly finalBalance = computed(() => this.yearlySchedule().at(-1)?.balance ?? this.inputs().initial);
    readonly realFinalBalance = computed(() => this.yearlySchedule().at(-1)?.realBalance ?? this.inputs().initial);
    readonly totalContrib = computed(() => this.yearlySchedule().at(-1)?.totalContrib ?? 0);
    readonly totalInterest = computed(() => this.yearlySchedule().at(-1)?.totalInterest ?? 0);

    // actions
    patchInputs(partial: Partial<CompoundInputs>) {
        this.inputs.update(s => ({ ...s, ...partial }));
    }

    reset() {
        this.inputs.set({ initial: 0, monthly: 100, years: 20, annualRatePct: 10, inflationPct: 0, timing: 'end' });
        this.ls.remove(STORAGE_KEY);
    }
}
