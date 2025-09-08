export function effectiveMonthly(annualRatePct: number): number {
    const r = annualRatePct / 100;
    return Math.pow(1 + r, 1 / 12) - 1; // effective monthly rate
}

export function fvAnnuity(p: number, r: number, n: number, due = false): number {
    if (r === 0) return p * n;
    const fv = p * ((Math.pow(1 + r, n) - 1) / r);
    return due ? fv * (1 + r) : fv;
}
