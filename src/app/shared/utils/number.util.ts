export function coerceNum(v: unknown, fallback = 0): number {
    const n = typeof v === 'string' ? (v.trim() === '' ? NaN : Number(v)) : Number(v);
    return Number.isFinite(n) ? n : fallback;
}