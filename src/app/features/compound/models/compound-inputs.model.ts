export type ContribTiming = 'begin' | 'end';

export interface CompoundInputs {
    initial: number;
    monthly: number;
    years: number;
    annualRatePct: number;
    inflationPct: number;
    timing: ContribTiming;
}
